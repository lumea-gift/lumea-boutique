const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generateGuide() {
  const outputPath = path.join(__dirname, 'data', 'guide-lumea.pdf');
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

  if (fs.existsSync(outputPath)) {
    console.log('Guide PDF already exists.');
    return Promise.resolve(outputPath);
  }

  const doc = new PDFDocument({ size: 'LETTER', margin: 0, bufferPages: true });
  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  const W = doc.page.width;   // 612
  const H = doc.page.height;  // 792

  // Colors
  const GOLD = '#C9A96E';
  const DARK = '#1A1A2E';
  const CREAM = '#FBF8F4';
  const WHITE = '#FFFFFF';
  const GRAY = '#5A5A6E';
  const LIGHT_GOLD = '#F5EFE3';
  const SOFT_PINK = '#FFF0F0';
  const SOFT_GREEN = '#F0FFF4';
  const SOFT_BLUE = '#F0F4FF';
  const RED_ACCENT = '#D4445C';
  const GREEN_CHECK = '#2D9F5C';

  let pageNum = 0;

  function newPage(bg) {
    if (pageNum > 0) doc.addPage();
    pageNum++;
    if (bg) doc.rect(0, 0, W, H).fill(bg);
  }

  function addFooter(dark) {
    const color = dark ? '#555555' : '#888888';
    doc.fontSize(8).fillColor(color).font('Helvetica')
      .text('LUMEA  \u2022  Routine Peau Parfaite 30 Jours', 60, H - 35, { width: W - 180, align: 'left' });
    doc.text(pageNum.toString(), W - 60, H - 35, { width: 30, align: 'right' });
    doc.rect(60, H - 45, W - 120, 0.5).fill(dark ? '#DDDDDD' : '#444444');
  }

  function sectionHeader(title, subtitle, color) {
    // Full-width colored banner
    doc.rect(0, 0, W, 140).fill(DARK);
    doc.rect(0, 138, W, 4).fill(GOLD);

    doc.fontSize(11).fillColor(GOLD).font('Helvetica')
      .text('L U M E A', 0, 30, { align: 'center', characterSpacing: 6 });

    doc.fontSize(26).fillColor(WHITE).font('Helvetica-Bold')
      .text(title, 0, 62, { align: 'center' });

    if (subtitle) {
      doc.fontSize(13).fillColor(GOLD).font('Helvetica')
        .text(subtitle, 0, 100, { align: 'center' });
    }

    doc.y = 165;
  }

  function tipBox(text, emoji, bgColor) {
    const boxX = 60, boxW = W - 120;
    const y = doc.y + 5;
    // Measure text height
    const textH = doc.heightOfString(text, { width: boxW - 70, fontSize: 11 });
    const boxH = Math.max(textH + 30, 50);

    doc.roundedRect(boxX, y, boxW, boxH, 8).fill(bgColor);
    doc.roundedRect(boxX, y, boxW, boxH, 8).strokeColor(GOLD).lineWidth(0.5).stroke();

    doc.fontSize(18).fillColor(GOLD).font('Helvetica')
      .text(emoji || '\u2605', boxX + 15, y + (boxH / 2) - 10, { width: 30 });

    doc.fontSize(11).fillColor(DARK).font('Helvetica')
      .text(text, boxX + 50, y + 15, { width: boxW - 70, lineGap: 3 });

    doc.y = y + boxH + 15;
  }

  function numberedStep(num, title, desc) {
    const y = doc.y;
    // Gold circle with number
    doc.circle(85, y + 12, 14).fill(GOLD);
    doc.fontSize(12).fillColor(WHITE).font('Helvetica-Bold')
      .text(num.toString(), 75, y + 5, { width: 20, align: 'center' });

    doc.fontSize(13).fillColor(DARK).font('Helvetica-Bold')
      .text(title, 110, y + 3, { width: W - 180 });

    doc.fontSize(11).fillColor(GRAY).font('Helvetica')
      .text(desc, 110, doc.y + 3, { width: W - 180, lineGap: 3 });

    doc.moveDown(0.8);
  }

  function goldBullet(text) {
    const y = doc.y;
    doc.circle(80, y + 5, 3).fill(GOLD);
    doc.fontSize(11).fillColor(GRAY).font('Helvetica')
      .text(text, 95, y, { width: W - 170, lineGap: 2 });
    doc.moveDown(0.3);
  }

  function checkItem(text) {
    const y = doc.y;
    // Checkbox
    doc.roundedRect(80, y, 13, 13, 2).strokeColor(GOLD).lineWidth(1).stroke();
    doc.fontSize(11).fillColor(DARK).font('Helvetica')
      .text(text, 102, y + 1, { width: W - 175, lineGap: 2 });
    doc.moveDown(0.4);
  }

  function ingredientCard(name, usage, benefit, bgColor) {
    const y = doc.y;
    const cardW = W - 120;
    const textH = doc.heightOfString(benefit, { width: cardW - 40, fontSize: 10 });
    const cardH = textH + 55;

    doc.roundedRect(60, y, cardW, cardH, 6).fill(bgColor);

    doc.fontSize(12).fillColor(DARK).font('Helvetica-Bold')
      .text(name, 80, y + 12, { width: cardW - 160 });

    // Usage badge
    const badgeW = doc.widthOfString(usage, { fontSize: 9 }) + 16;
    doc.roundedRect(W - 80 - badgeW, y + 10, badgeW, 20, 10).fill(GOLD);
    doc.fontSize(9).fillColor(WHITE).font('Helvetica-Bold')
      .text(usage, W - 80 - badgeW + 8, y + 15, { width: badgeW - 16 });

    doc.fontSize(10).fillColor(GRAY).font('Helvetica')
      .text(benefit, 80, y + 38, { width: cardW - 40, lineGap: 2 });

    doc.y = y + cardH + 8;
  }

  function maskRecipe(num, name, skinType, ingredients, steps, bgColor) {
    const y = doc.y;
    if (y > H - 250) {
      newPage(CREAM);
      sectionHeader('Masques Maison', 'Recettes naturelles (suite)');
      addFooter(true);
    }

    const cardW = W - 120;
    const stepsH = doc.heightOfString(steps, { width: cardW - 80, fontSize: 10 });
    const ingH = doc.heightOfString(ingredients, { width: cardW - 80, fontSize: 10 });
    const cardH = stepsH + ingH + 95;

    doc.roundedRect(60, doc.y, cardW, cardH, 8).fill(bgColor);

    const cy = doc.y;
    // Recipe number circle
    doc.circle(85, cy + 22, 16).fill(GOLD);
    doc.fontSize(14).fillColor(WHITE).font('Helvetica-Bold')
      .text(num.toString(), 75, cy + 15, { width: 20, align: 'center' });

    doc.fontSize(14).fillColor(DARK).font('Helvetica-Bold')
      .text(name, 110, cy + 12, { width: cardW - 80 });

    doc.fontSize(9).fillColor(GOLD).font('Helvetica-Oblique')
      .text('Pour : ' + skinType, 110, cy + 32, { width: cardW - 80 });

    doc.fontSize(10).fillColor(DARK).font('Helvetica-Bold')
      .text('\u2022 Ingredients :', 80, cy + 52);
    doc.fontSize(10).fillColor(GRAY).font('Helvetica')
      .text(ingredients, 100, doc.y + 2, { width: cardW - 80, lineGap: 2 });

    doc.moveDown(0.4);
    doc.fontSize(10).fillColor(DARK).font('Helvetica-Bold')
      .text('\u2022 Preparation :', 80, doc.y);
    doc.fontSize(10).fillColor(GRAY).font('Helvetica')
      .text(steps, 100, doc.y + 2, { width: cardW - 80, lineGap: 2 });

    doc.y = cy + cardH + 12;
  }

  // ==============================================================
  //  PAGE 1 : COVER
  // ==============================================================
  newPage(DARK);

  // Top & bottom gold lines
  doc.rect(40, 40, W - 80, 1.5).fill(GOLD);
  doc.rect(40, H - 40, W - 80, 1.5).fill(GOLD);

  // Corner details
  [[40,40],[W-55,40],[40,H-55],[W-55,H-55]].forEach(([cx, cy]) => {
    doc.rect(cx, cy, 15, 1.5).fill(GOLD);
    doc.rect(cx, cy, 1.5, 15).fill(GOLD);
  });

  // Decorative circle
  doc.circle(W / 2, 230, 80).lineWidth(1).strokeColor(GOLD).stroke();
  doc.circle(W / 2, 230, 70).lineWidth(0.5).strokeColor('#555555').stroke();

  doc.fontSize(12).fillColor(GOLD).font('Helvetica')
    .text('L U M E A', 0, 215, { align: 'center', characterSpacing: 8 });
  doc.fontSize(9).fillColor('#888888').font('Helvetica')
    .text('SKINCARE', 0, 235, { align: 'center', characterSpacing: 6 });

  doc.moveDown(6);
  doc.fontSize(40).fillColor(WHITE).font('Helvetica-Bold')
    .text('Routine Peau', { align: 'center' });
  doc.fontSize(44).fillColor(GOLD).font('Helvetica-BoldOblique')
    .text('Parfaite', { align: 'center' });
  doc.fontSize(40).fillColor(WHITE).font('Helvetica-Bold')
    .text('30 Jours', { align: 'center' });

  // Gold separator
  doc.rect(W / 2 - 40, doc.y + 15, 80, 2).fill(GOLD);

  doc.moveDown(2.5);
  doc.fontSize(13).fillColor('#BBBBBB').font('Helvetica')
    .text('Le guide complet pour transformer', { align: 'center' });
  doc.text('votre peau en 30 jours', { align: 'center' });

  doc.moveDown(3);

  // 3 feature badges
  const badges = ['25+ Pages', 'Acces a vie', '5 Masques DIY'];
  const badgeStartX = W / 2 - 180;
  badges.forEach((b, i) => {
    const bx = badgeStartX + i * 130;
    doc.roundedRect(bx, doc.y, 110, 28, 14).strokeColor(GOLD).lineWidth(0.8).stroke();
    doc.fontSize(9).fillColor(GOLD).font('Helvetica')
      .text(b, bx, doc.y + 9, { width: 110, align: 'center' });
  });

  doc.y += 55;
  doc.fontSize(10).fillColor(GOLD).font('Helvetica')
    .text('Par les experts LUMEA', { align: 'center' });
  doc.fontSize(9).fillColor('#666666').font('Helvetica')
    .text('Edition 2025 | Canada', { align: 'center' });

  // ==============================================================
  //  PAGE 2 : TABLE DES MATIERES
  // ==============================================================
  newPage(CREAM);
  sectionHeader('Table des Matieres', 'Votre parcours vers une peau parfaite');
  addFooter(true);

  const toc = [
    ['01', 'Introduction', 'Votre peau merite le meilleur'],
    ['02', 'Votre type de peau', 'Identifier et comprendre votre peau'],
    ['03', 'Les 5 piliers', 'Les fondamentaux essentiels'],
    ['04', 'Routine du matin', '5 etapes en 5 minutes'],
    ['05', 'Routine du soir', 'Reparation et actifs puissants'],
    ['06', 'Ingredients miracles', '8 actifs prouves scientifiquement'],
    ['07', 'Masques maison', '5 recettes avec vos ingredients'],
    ['08', 'Alimentation beaute', 'Nourrir sa peau de l\'interieur'],
    ['09', 'Erreurs fatales', '11 erreurs a eviter absolument'],
    ['10', 'Calendrier 30 jours', 'Votre plan d\'action jour par jour'],
    ['11', 'FAQ & Bonus', 'Reponses et conseils supplementaires'],
  ];

  doc.y = 175;
  toc.forEach(([num, title, sub]) => {
    const y = doc.y;
    doc.roundedRect(60, y, W - 120, 42, 6).fill(WHITE);

    // Number circle
    doc.circle(88, y + 21, 14).fill(GOLD);
    doc.fontSize(11).fillColor(WHITE).font('Helvetica-Bold')
      .text(num, 78, y + 14, { width: 20, align: 'center' });

    doc.fontSize(13).fillColor(DARK).font('Helvetica-Bold')
      .text(title, 115, y + 8, { width: 300 });
    doc.fontSize(9).fillColor(GRAY).font('Helvetica')
      .text(sub, 115, y + 25, { width: 300 });

    // Dots + arrow
    doc.fontSize(10).fillColor(GOLD).font('Helvetica')
      .text('\u2192', W - 85, y + 13, { width: 20 });

    doc.y = y + 48;
  });

  // ==============================================================
  //  PAGE 3 : INTRODUCTION
  // ==============================================================
  newPage(CREAM);
  sectionHeader('Introduction', 'Votre peau merite le meilleur');
  addFooter(true);

  doc.y = 175;
  doc.fontSize(12).fillColor(DARK).font('Helvetica')
    .text('Felicitations pour votre decision d\'investir dans votre peau !', 60, doc.y, { width: W - 120, lineGap: 4 });
  doc.moveDown(0.5);
  doc.fontSize(11).fillColor(GRAY).font('Helvetica')
    .text('Ce guide est le fruit de 5 annees de recherche en dermatologie et de collaboration avec des experts en soins de la peau au Canada. Dans les 30 prochains jours, vous allez decouvrir une methode eprouvee qui a deja aide plus de 15 000 femmes a transformer leur peau.', 60, doc.y, { width: W - 120, lineGap: 4 });

  doc.moveDown(1);
  tipBox('"La beaute de la peau commence par une routine adaptee et constante. Pas de produits miracles, mais une methode qui fonctionne."', '\u201C', LIGHT_GOLD);

  doc.moveDown(0.5);
  doc.fontSize(16).fillColor(DARK).font('Helvetica-Bold')
    .text('Ce que vous allez apprendre', 60, doc.y);
  doc.moveDown(0.8);

  const introPoints = [
    'Comment identifier votre type de peau exactement',
    'La routine matin et soir adaptee a VOS besoins',
    'Les ingredients qui fonctionnent vraiment (et ceux a eviter)',
    'Des recettes de masques maison avec des ingredients de cuisine',
    'Un calendrier jour par jour pour les 30 prochains jours',
    'Les erreurs que 90% des femmes font (et comment les corriger)',
  ];
  introPoints.forEach(p => goldBullet(p));

  // ==============================================================
  //  PAGE 4 : TYPES DE PEAU
  // ==============================================================
  newPage(CREAM);
  sectionHeader('Chapitre 1', 'Comprendre votre type de peau');
  addFooter(true);

  doc.y = 170;
  doc.fontSize(11).fillColor(GRAY).font('Helvetica')
    .text('Avant de commencer toute routine, il est essentiel de connaitre votre type de peau. Un soin mal adapte peut aggraver vos problemes au lieu de les resoudre.', 60, doc.y, { width: W - 120, lineGap: 4 });
  doc.moveDown(1);

  const skinTypes = [
    { title: 'Peau Normale', emoji: '\u2728', desc: 'Teint uniforme, peu de brillance, pores fins. Votre routine sera axee sur le maintien et la prevention.', bg: SOFT_GREEN },
    { title: 'Peau Seche', emoji: '\u2744', desc: 'Tiraillements, desquamation, teint terne. Privilegiez les textures riches et l\'acide hyaluronique.', bg: SOFT_BLUE },
    { title: 'Peau Grasse', emoji: '\u2600', desc: 'Brillance excessive, pores dilates. Utilisez des textures legeres et des actifs matifiants comme la niacinamide.', bg: LIGHT_GOLD },
    { title: 'Peau Mixte', emoji: '\u25D0', desc: 'Zone T grasse, joues seches. La cle est d\'adapter les soins par zone avec des textures differentes.', bg: SOFT_PINK },
    { title: 'Peau Sensible', emoji: '\u2665', desc: 'Rougeurs, irritations. Privilegiez les formules douces, sans parfum et hypoallergeniques.', bg: '#FFF5F5' },
  ];

  skinTypes.forEach(s => {
    const y = doc.y;
    const cardH = 65;
    doc.roundedRect(60, y, W - 120, cardH, 8).fill(s.bg);

    doc.fontSize(16).fillColor(GOLD).font('Helvetica')
      .text(s.emoji, 75, y + 10);

    doc.fontSize(13).fillColor(DARK).font('Helvetica-Bold')
      .text(s.title, 105, y + 10, { width: W - 200 });
    doc.fontSize(10).fillColor(GRAY).font('Helvetica')
      .text(s.desc, 105, y + 28, { width: W - 200, lineGap: 2 });

    doc.y = y + cardH + 8;
  });

  // ==============================================================
  //  PAGE 5 : LES 5 PILIERS
  // ==============================================================
  newPage(CREAM);
  sectionHeader('Chapitre 2', 'Les 5 piliers d\'une peau parfaite');
  addFooter(true);

  doc.y = 165;
  const pillars = [
    { num: '01', title: 'NETTOYAGE', text: 'Un nettoyage doux matin et soir. Massez delicatement en mouvements circulaires pendant 60 secondes. Jamais d\'eau chaude.' },
    { num: '02', title: 'HYDRATATION', text: 'Meme les peaux grasses ont besoin d\'hydratation ! Renforcez la barriere cutanee. Appliquez toujours sur peau humide.' },
    { num: '03', title: 'PROTECTION SOLAIRE', text: 'SPF 30+ chaque matin, meme en hiver. Les UV causent 80% du vieillissement cutane. C\'est le produit anti-age #1.' },
    { num: '04', title: 'NUTRITION', text: 'Antioxydants, omega-3, et 2L d\'eau par jour. Votre peau reflete ce que vous mangez.' },
    { num: '05', title: 'SOMMEIL', text: '7-8 heures de sommeil. Taie d\'oreiller en soie pour reduire frictions et rides. La peau se regenere la nuit.' },
  ];

  pillars.forEach(p => {
    const y = doc.y;
    const cardH = 72;
    doc.roundedRect(60, y, W - 120, cardH, 8).fill(WHITE);
    doc.roundedRect(60, y, W - 120, cardH, 8).strokeColor('#E8E0D4').lineWidth(0.5).stroke();

    // Large number
    doc.fontSize(28).fillColor(GOLD).font('Helvetica-Bold')
      .text(p.num, 75, y + 8);

    doc.fontSize(13).fillColor(DARK).font('Helvetica-Bold')
      .text(p.title, 125, y + 10, { width: W - 210, characterSpacing: 1 });
    doc.fontSize(10).fillColor(GRAY).font('Helvetica')
      .text(p.text, 125, y + 30, { width: W - 210, lineGap: 3 });

    doc.y = y + cardH + 8;
  });

  doc.moveDown(0.5);
  tipBox('Astuce : La constance est plus importante que le produit ! Une routine simple suivie chaque jour bat une routine complexe suivie 2 fois par semaine.', '\u2605', LIGHT_GOLD);

  // ==============================================================
  //  PAGE 6 : ROUTINE MATIN
  // ==============================================================
  newPage(CREAM);
  sectionHeader('Chapitre 3', 'Routine du matin \u2014 5 etapes en 5 minutes');
  addFooter(true);

  doc.y = 170;
  doc.fontSize(11).fillColor(GRAY).font('Helvetica')
    .text('Votre routine du matin protege votre peau pour la journee. Simple, rapide, efficace.', 60, doc.y, { width: W - 120, lineGap: 3 });
  doc.moveDown(1);

  const morningSteps = [
    ['Nettoyage doux (1 min)', 'Nettoyant sans sulfate. Massez en cercles, rincez a l\'eau tiede. Jamais d\'eau chaude qui agresse la barriere cutanee.'],
    ['Tonique hydratant (30 sec)', 'Sans alcool, appliquez avec les mains (pas de coton). Tapotez delicatement. Prepare la peau a recevoir les soins.'],
    ['Serum Vitamine C (1 min)', 'Votre meilleur allie eclat + anti-age. 3-4 gouttes sur peau encore humide pour maximiser la penetration.'],
    ['Creme hydratante (1 min)', 'Texture legere (peau grasse) ou riche (peau seche). Mouvements ascendants du menton vers le front.'],
    ['SPF 30+ obligatoire (1 min)', 'LA etape la plus importante ! 2 doigts de produit, 15 min avant exposition. Reappliquez toutes les 2h si exterieur.'],
  ];

  morningSteps.forEach((s, i) => numberedStep(i + 1, s[0], s[1]));

  doc.moveDown(0.5);
  tipBox('Ordre d\'application : toujours du plus leger au plus epais. Serum avant creme, toujours ! Le SPF est toujours la derniere etape.', '\u2605', SOFT_BLUE);

  // ==============================================================
  //  PAGE 7 : ROUTINE SOIR
  // ==============================================================
  newPage(CREAM);
  sectionHeader('Chapitre 4', 'Routine du soir \u2014 Reparation nocturne');
  addFooter(true);

  doc.y = 170;
  doc.fontSize(11).fillColor(GRAY).font('Helvetica')
    .text('La nuit, votre peau se repare. C\'est le moment d\'utiliser vos actifs les plus puissants. Duree : 7-10 minutes.', 60, doc.y, { width: W - 120, lineGap: 3 });
  doc.moveDown(1);

  const eveningSteps = [
    ['Double nettoyage (2 min)', 'Huile ou baume pour dissoudre maquillage + creme solaire, puis nettoyant habituel. Peau parfaitement propre garantie.'],
    ['Exfoliation 2x/semaine (2 min)', 'AHA (acide glycolique) pour peaux seches. BHA (acide salicylique) pour peaux grasses. Jamais plus de 2x/semaine.'],
    ['Serum de nuit (1 min)', 'Retinol = anti-age #1. Commencez a 0.3%, augmentez progressivement. Alternez avec la vitamine C (pas le meme soir).'],
    ['Contour des yeux (30 sec)', 'Peau 5x plus fine autour des yeux. Cafeine (anti-poches) ou retinol (anti-rides). Tapotez avec l\'annulaire.'],
    ['Creme de nuit ou huile (1 min)', 'Plus riche que le jour. Huile de jojoba ou rose musquee. La peau se regenere entre 22h et 2h du matin.'],
  ];

  eveningSteps.forEach((s, i) => numberedStep(i + 1, s[0], s[1]));

  doc.moveDown(0.5);
  tipBox('Important : Ne combinez JAMAIS retinol + AHA/BHA le meme soir. Alternez un soir sur deux pour eviter les irritations.', '\u26A0', SOFT_PINK);

  // ==============================================================
  //  PAGE 8 : INGREDIENTS MIRACLES
  // ==============================================================
  newPage(CREAM);
  sectionHeader('Chapitre 5', 'Les 8 ingredients miracles');
  addFooter(true);

  doc.y = 160;
  doc.fontSize(11).fillColor(GRAY).font('Helvetica')
    .text('Ces actifs sont prouves scientifiquement. Apprenez a les reconnaitre sur les etiquettes de vos produits.', 60, doc.y, { width: W - 120, lineGap: 3 });
  doc.moveDown(0.8);

  const ingredients = [
    ['Vitamine C', 'Matin', 'Eclat, anti-taches, antioxydant. Concentration 10-20%. Forme L-ascorbique = la plus efficace.', SOFT_GREEN],
    ['Retinol', 'Soir', 'Anti-age #1. Stimule le renouvellement cellulaire. Commencer 2x/semaine puis augmenter.', SOFT_PINK],
    ['Acide hyaluronique', 'Matin+Soir', 'Retient 1000x son poids en eau. Appliquer sur peau humide obligatoirement.', SOFT_BLUE],
    ['Niacinamide (B3)', 'Matin+Soir', 'Resserre les pores, controle le sebum, unifie le teint. 5-10%. Compatible avec tout.', LIGHT_GOLD],
  ];

  ingredients.forEach(([name, use, benefit, bg]) => ingredientCard(name, use, benefit, bg));

  // Page 9 : Suite des ingredients
  newPage(CREAM);
  sectionHeader('Chapitre 5', 'Ingredients miracles (suite)');
  addFooter(true);
  doc.y = 160;

  const ingredients2 = [
    ['AHA (Acide glycolique)', '2x/sem soir', 'Exfoliant chimique pour peaux seches/ternes. Revele un teint lumineux. SPF obligatoire le lendemain.', SOFT_GREEN],
    ['BHA (Acide salicylique)', '2x/sem soir', 'Penetre les pores pour les nettoyer en profondeur. Ideal peaux grasses/acneiques. 1-2%.', SOFT_BLUE],
    ['Peptides', 'Matin+Soir', 'Stimulent la production de collagene. Complement ideal du retinol. Peptides de cuivre ou Matrixyl.', LIGHT_GOLD],
    ['SPF (Filtres solaires)', 'Matin', 'SPF 30 minimum. Reappliquer toutes les 2h. Le geste anti-age le plus sous-estime.', SOFT_PINK],
  ];

  ingredients2.forEach(([name, use, benefit, bg]) => ingredientCard(name, use, benefit, bg));

  doc.moveDown(0.5);
  tipBox('Un serum vitamine C a 20$ peut etre aussi efficace qu\'un a 100$. Lisez les etiquettes (INCI), pas les publicites !', '\u2605', LIGHT_GOLD);

  // ==============================================================
  //  PAGE 10-11 : MASQUES MAISON
  // ==============================================================
  newPage(CREAM);
  sectionHeader('Chapitre 6', '5 recettes de masques maison');
  addFooter(true);

  doc.y = 160;
  doc.fontSize(11).fillColor(GRAY).font('Helvetica')
    .text('Des masques efficaces avec des ingredients de votre cuisine. A faire 1 a 2 fois par semaine.', 60, doc.y, { width: W - 120, lineGap: 3 });
  doc.moveDown(0.8);

  maskRecipe(1, 'Masque Eclat au Miel & Curcuma', 'Tous types de peau',
    '2 c. a soupe de miel brut + 1/2 c. a the de curcuma + 1 c. a soupe de yogourt nature',
    'Melangez tout. Appliquez sur visage propre, 15-20 min. Rincez a l\'eau tiede. Le curcuma illumine, le miel hydrate.', LIGHT_GOLD);

  maskRecipe(2, 'Masque Purifiant au Charbon', 'Peaux grasses/mixtes',
    '1 capsule de charbon actif + 1 c. a soupe d\'argile verte + eau de rose',
    'Melangez pour former une pate. Couche fine, 10 min max. Ne laissez JAMAIS secher completement. Rincez.', SOFT_BLUE);

  maskRecipe(3, 'Masque Hydratant a l\'Avocat', 'Peaux seches/deshydratees',
    '1/2 avocat mur + 1 c. a soupe de miel + quelques gouttes d\'huile de jojoba',
    'Ecrasez l\'avocat, melangez. Couche epaisse, 20 min. Peau repulpee et nourrie en profondeur.', SOFT_GREEN);

  maskRecipe(4, 'Masque Anti-Age au Blanc d\'Oeuf', 'Peaux matures',
    '1 blanc d\'oeuf + 1 c. a soupe de jus de citron + 1 c. a the de miel',
    'Battez le blanc. Ajoutez citron + miel. 2 couches, 15 min. Effet tenseur immediat !', SOFT_PINK);

  maskRecipe(5, 'Masque Apaisant Aloe Vera', 'Peaux sensibles/irritees',
    '2 c. a soupe gel d\'aloe vera pur + 1 c. a soupe eau de concombre + 2 gouttes huile de camomille',
    'Melangez et gardez au frigo 10 min. Couche epaisse, 20 min. Ideal apres irritation ou coup de soleil.', '#F0FFF8');

  // ==============================================================
  //  PAGE 12 : ALIMENTATION
  // ==============================================================
  newPage(CREAM);
  sectionHeader('Chapitre 7', 'Alimentation & beaute de la peau');
  addFooter(true);

  doc.y = 165;
  doc.fontSize(11).fillColor(GRAY).font('Helvetica')
    .text('Ce que vous mangez a un impact direct sur votre peau. Voici les aliments a privilegier et ceux a limiter.', 60, doc.y, { width: W - 120, lineGap: 3 });
  doc.moveDown(1);

  // Good foods box
  doc.roundedRect(60, doc.y, W - 120, 20, 4).fill(GREEN_CHECK);
  doc.fontSize(12).fillColor(WHITE).font('Helvetica-Bold')
    .text('\u2713  ALIMENTS A PRIVILEGIER', 75, doc.y + 4, { width: W - 140 });
  doc.y += 28;

  const goodFoods = [
    'Saumon, sardines (omega-3 anti-inflammatoires)',
    'Baies : myrtilles, framboises (antioxydants puissants)',
    'Avocat (graisses saines pour la souplesse)',
    'Patates douces, carottes (beta-carotene = vitamine A)',
    'Noix, amandes, graines de lin (vitamine E + zinc)',
    'The vert (polyphenols anti-age)',
    'Epinards, kale (vitamines A, C, K et fer)',
    'Eau : 2L/jour minimum (hydratation cellulaire)',
  ];
  goodFoods.forEach(f => goldBullet(f));

  doc.moveDown(0.8);

  // Bad foods box
  doc.roundedRect(60, doc.y, W - 120, 20, 4).fill(RED_ACCENT);
  doc.fontSize(12).fillColor(WHITE).font('Helvetica-Bold')
    .text('\u2717  ALIMENTS A LIMITER', 75, doc.y + 4, { width: W - 140 });
  doc.y += 28;

  const badFoods = [
    'Sucre raffine \u2014 accelere le vieillissement (glycation)',
    'Produits laitiers \u2014 peuvent aggraver l\'acne',
    'Alcool \u2014 deshydrate la peau, dilate les vaisseaux',
    'Aliments ultra-transformes \u2014 inflammatoires',
    'Exces de sel \u2014 retention d\'eau, poches sous les yeux',
  ];
  badFoods.forEach(f => {
    const y = doc.y;
    doc.circle(80, y + 5, 3).fill(RED_ACCENT);
    doc.fontSize(11).fillColor(GRAY).font('Helvetica')
      .text(f, 95, y, { width: W - 170, lineGap: 2 });
    doc.moveDown(0.3);
  });

  // ==============================================================
  //  PAGE 13 : ERREURS
  // ==============================================================
  newPage(CREAM);
  sectionHeader('Chapitre 8', '11 erreurs fatales a eviter');
  addFooter(true);

  doc.y = 162;
  const mistakes = [
    ['Dormir avec son maquillage', 'Obstrue les pores, cause acne et vieillissement premature.'],
    ['Utiliser de l\'eau chaude', 'Detruit le film hydrolipidique. Toujours tiede ou froide.'],
    ['Changer de routine chaque semaine', 'Un produit a besoin de 4-6 semaines pour montrer ses effets.'],
    ['Oublier le cou et le decollete', 'Ces zones vieillissent aussi vite que le visage.'],
    ['Exfolier tous les jours', 'Detruit la barriere cutanee. Maximum 2 fois par semaine.'],
    ['Appliquer le retinol le matin', 'Il est photosensibilisant. Uniquement le soir.'],
    ['Melanger retinol + AHA/BHA', 'Ne jamais combiner le meme soir. Alternez.'],
    ['Oublier le SPF', '80% du vieillissement est cause par les UV.'],
    ['Toucher son visage', 'Transfert de bacteries = boutons.'],
    ['Utiliser des produits perimes', 'Verifiez la PAO (Periode Apres Ouverture).'],
    ['Manquer de regularite', 'La constance est plus importante que le produit.'],
  ];

  mistakes.forEach(([title, desc], i) => {
    if (doc.y > H - 80) {
      newPage(CREAM);
      sectionHeader('Chapitre 8', 'Erreurs fatales (suite)');
      addFooter(true);
      doc.y = 162;
    }
    const y = doc.y;
    const cardH = 44;
    doc.roundedRect(60, y, W - 120, cardH, 6).fill(i % 2 === 0 ? WHITE : '#FFF8F8');

    // Red number
    doc.circle(85, y + cardH / 2, 12).fill(RED_ACCENT);
    doc.fontSize(10).fillColor(WHITE).font('Helvetica-Bold')
      .text((i + 1).toString(), 76, y + cardH / 2 - 6, { width: 18, align: 'center' });

    doc.fontSize(11).fillColor(DARK).font('Helvetica-Bold')
      .text(title, 108, y + 8, { width: W - 200 });
    doc.fontSize(10).fillColor(GRAY).font('Helvetica')
      .text(desc, 108, y + 24, { width: W - 200 });

    doc.y = y + cardH + 5;
  });

  // ==============================================================
  //  PAGE 14-15 : CALENDRIER 30 JOURS
  // ==============================================================
  newPage(CREAM);
  sectionHeader('Chapitre 9', 'Plan d\'action 30 jours');
  addFooter(true);

  doc.y = 165;
  doc.fontSize(11).fillColor(GRAY).font('Helvetica')
    .text('Cochez chaque etape accomplie. La regularite est la cle du succes !', 60, doc.y, { width: W - 120, lineGap: 3 });
  doc.moveDown(0.8);

  // WEEK 1
  doc.roundedRect(60, doc.y, W - 120, 24, 4).fill(GOLD);
  doc.fontSize(13).fillColor(WHITE).font('Helvetica-Bold')
    .text('SEMAINE 1 : Preparation', 75, doc.y + 5);
  doc.y += 32;

  ['Jour 1-3 : Nettoyage matin + soir + hydratant uniquement. Observez votre peau.',
   'Jour 4 : Ajoutez le serum vitamine C le matin.',
   'Jour 5 : Ajoutez la creme solaire SPF 30+ le matin.',
   'Jour 6 : Premiere exfoliation douce le soir (AHA ou BHA).',
   'Jour 7 : Jour de repos \u2014 masque hydratant maison. Evaluez.',
  ].forEach(d => checkItem(d));

  doc.moveDown(0.5);

  // WEEK 2
  doc.roundedRect(60, doc.y, W - 120, 24, 4).fill(GOLD);
  doc.fontSize(13).fillColor(WHITE).font('Helvetica-Bold')
    .text('SEMAINE 2 : Construction', 75, doc.y + 5);
  doc.y += 32;

  ['Jour 8-10 : Routine de base + contour des yeux le soir.',
   'Jour 11 : Introduisez le retinol (faible dose) 1x cette semaine.',
   'Jour 12 : Deuxieme exfoliation de la semaine.',
   'Jour 13 : Masque purifiant.',
   'Jour 14 : Evaluez. Moins de brillance ? Plus d\'eclat ? Ajustez.',
  ].forEach(d => checkItem(d));

  // Page 15 : Semaines 3-4
  newPage(CREAM);
  sectionHeader('Chapitre 9', 'Calendrier 30 jours (suite)');
  addFooter(true);
  doc.y = 165;

  // WEEK 3
  doc.roundedRect(60, doc.y, W - 120, 24, 4).fill(GOLD);
  doc.fontSize(13).fillColor(WHITE).font('Helvetica-Bold')
    .text('SEMAINE 3 : Intensification', 75, doc.y + 5);
  doc.y += 32;

  ['Jour 15-17 : Retinol 2x par semaine.',
   'Jour 18 : Essayez le double nettoyage le soir.',
   'Jour 19 : Masque eclat au miel et curcuma.',
   'Jour 20 : Augmentez la concentration vitamine C si toleree.',
   'Jour 21 : Photo de progression ! Comparez avec le jour 1.',
  ].forEach(d => checkItem(d));

  doc.moveDown(0.5);

  // WEEK 4
  doc.roundedRect(60, doc.y, W - 120, 24, 4).fill(GOLD);
  doc.fontSize(13).fillColor(WHITE).font('Helvetica-Bold')
    .text('SEMAINE 4 : Transformation', 75, doc.y + 5);
  doc.y += 32;

  ['Jour 22-25 : Routine complete installee. Maintenez la regularite.',
   'Jour 26 : Masque anti-age ou hydratant selon votre besoin.',
   'Jour 27 : Evaluez vos resultats. Quels produits sont vos favoris ?',
   'Jour 28-29 : Affinez votre routine definitive.',
   'Jour 30 : Photo finale ! Celebrez votre transformation !',
  ].forEach(d => checkItem(d));

  doc.moveDown(1);
  tipBox('Prenez une photo de votre peau le Jour 1 et le Jour 30, meme eclairage. Vous serez impressionnee par le changement !', '\u2605', LIGHT_GOLD);

  // ==============================================================
  //  PAGE 16 : FAQ
  // ==============================================================
  newPage(CREAM);
  sectionHeader('FAQ', 'Questions frequentes & conseils bonus');
  addFooter(true);

  doc.y = 165;
  const faqs = [
    ['Combien de temps avant de voir des resultats ?', 'Premiers changements (hydratation, eclat) en 7-14 jours. Resultats significatifs (taches, rides, texture) en 4-8 semaines.'],
    ['Puis-je utiliser ces conseils si je suis enceinte ?', 'Evitez le retinol et les AHA/BHA forts. Consultez votre dermatologue. Le reste du guide (hydratation, SPF, alimentation) est parfait.'],
    ['Dois-je acheter des produits chers ?', 'Non ! L\'important c\'est les ingredients, pas la marque. Un serum a 20$ peut etre aussi efficace qu\'un a 100$.'],
    ['Comment savoir si un produit ne me convient pas ?', 'Test sur une petite zone (derriere l\'oreille) 24h avant. Si rougeur ou irritation, arretez. Leger picotement avec AHA = normal.'],
    ['Le masque au citron est-il dangereux ?', 'Le citron pur est trop acide (pH 2). Dans nos recettes, il est dilue avec miel et blanc d\'oeuf. Ne jamais appliquer pur.'],
  ];

  faqs.forEach(([q, a]) => {
    if (doc.y > H - 120) {
      newPage(CREAM);
      sectionHeader('FAQ', 'Questions frequentes (suite)');
      addFooter(true);
      doc.y = 165;
    }
    const y = doc.y;
    const aH = doc.heightOfString('R: ' + a, { width: W - 180, fontSize: 10 });
    const cardH = aH + 42;

    doc.roundedRect(60, y, W - 120, cardH, 6).fill(WHITE);

    doc.fontSize(12).fillColor(DARK).font('Helvetica-Bold')
      .text('Q:  ' + q, 75, y + 10, { width: W - 160 });

    doc.fontSize(10).fillColor(GRAY).font('Helvetica')
      .text('R:  ' + a, 75, y + 30, { width: W - 160, lineGap: 2 });

    doc.y = y + cardH + 8;
  });

  // ==============================================================
  //  LAST PAGE : MERCI
  // ==============================================================
  newPage(DARK);

  doc.rect(40, 40, W - 80, 1.5).fill(GOLD);
  doc.rect(40, H - 40, W - 80, 1.5).fill(GOLD);

  [[40,40],[W-55,40],[40,H-55],[W-55,H-55]].forEach(([cx, cy]) => {
    doc.rect(cx, cy, 15, 1.5).fill(GOLD);
    doc.rect(cx, cy, 1.5, 15).fill(GOLD);
  });

  doc.circle(W / 2, 250, 60).lineWidth(1).strokeColor(GOLD).stroke();

  doc.fontSize(12).fillColor(GOLD).font('Helvetica')
    .text('L U M E A', 0, 237, { align: 'center', characterSpacing: 8 });
  doc.fontSize(9).fillColor('#888888').font('Helvetica')
    .text('SKINCARE', 0, 255, { align: 'center', characterSpacing: 6 });

  doc.moveDown(5);
  doc.fontSize(36).fillColor(WHITE).font('Helvetica-Bold')
    .text('Merci !', { align: 'center' });

  doc.moveDown(1);
  doc.fontSize(16).fillColor(GOLD).font('Helvetica')
    .text('Votre peau vous remerciera.', { align: 'center' });

  doc.moveDown(0.5);
  doc.fontSize(13).fillColor('#AAAAAA').font('Helvetica')
    .text('Commencez des aujourd\'hui et prenez', { align: 'center' });
  doc.text('votre photo du Jour 1 !', { align: 'center' });

  doc.moveDown(4);
  doc.fontSize(11).fillColor(GOLD).font('Helvetica')
    .text('lumea-boutique.onrender.com', { align: 'center' });

  doc.moveDown(2);
  doc.fontSize(9).fillColor('#555555').font('Helvetica')
    .text('Ce guide est protege par le droit d\'auteur.', { align: 'center' });
  doc.text('Toute reproduction est interdite sans autorisation.', { align: 'center' });
  doc.moveDown(0.5);
  doc.text('\u00A9 2025 LUMEA Canada. Tous droits reserves.', { align: 'center' });

  // Finalize
  doc.end();

  return new Promise((resolve, reject) => {
    stream.on('finish', () => {
      console.log('Guide PDF generated:', outputPath);
      resolve(outputPath);
    });
    stream.on('error', reject);
  });
}

if (require.main === module) {
  generateGuide().then(() => console.log('Done!')).catch(console.error);
}

module.exports = { generateGuide };
