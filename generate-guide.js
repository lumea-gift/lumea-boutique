const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generateGuide() {
  const outputPath = path.join(__dirname, 'data', 'guide-lumea.pdf');
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
  if (fs.existsSync(outputPath)) { console.log('Guide PDF exists.'); return Promise.resolve(outputPath); }

  const doc = new PDFDocument({ size: 'LETTER', margin: 0, bufferPages: true });
  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  const W = 612, H = 792;
  const GOLD = '#C9A96E'; const DARK = '#1A1A2E'; const CREAM = '#FBF8F4'; const WHITE = '#FFFFFF';
  const GRAY = '#5A5A6E'; const LGOLD = '#F5EFE3'; const PINK = '#FFF0F0'; const GREEN = '#F0FFF4';
  const BLUE = '#F0F4FF'; const RED = '#D4445C'; const DGREEN = '#2D9F5C';
  let pg = 0;

  function np(bg) { if (pg > 0) doc.addPage(); pg++; if (bg) doc.rect(0, 0, W, H).fill(bg); }

  function footer() {
    doc.rect(60, H - 48, W - 120, 0.5).fill('#E0D8CC');
    doc.fontSize(7).fillColor('#AAAAAA').font('Helvetica')
      .text('LUMEA  \u2022  Guide Routine Peau Parfaite 30 Jours  \u2022  \u00A9 2025 LUMEA Canada', 60, H - 38, { width: W - 120, align: 'center' });
    doc.fontSize(8).fillColor(GOLD).text(pg.toString(), W - 55, H - 38, { width: 20, align: 'right' });
  }

  // Decorative pattern for headers
  function headerDeco() {
    for (let i = 0; i < 8; i++) {
      doc.circle(50 + i * 75, 120, 20 + i * 3).lineWidth(0.3).strokeColor('rgba(201,169,110,0.15)').stroke();
    }
  }

  function banner(title, sub) {
    doc.rect(0, 0, W, 130).fill(DARK);
    // Simple elegant line accent
    doc.rect(W / 2 - 25, 115, 50, 1).fill('rgba(201,169,110,0.3)');
    doc.rect(0, 128, W, 3).fill(GOLD);
    doc.fontSize(9).fillColor(GOLD).font('Helvetica')
      .text('L U M E A', 0, 22, { align: 'center', characterSpacing: 5 });
    doc.fontSize(22).fillColor(WHITE).font('Helvetica-Bold')
      .text(title, 0, 46, { align: 'center' });
    if (sub) doc.fontSize(11).fillColor(GOLD).font('Helvetica-Oblique')
      .text(sub, 0, 78, { align: 'center' });
    doc.y = 150;
  }

  function tip(text, emoji, bg) {
    const bx = 60, bw = W - 120, y0 = doc.y + 4;
    const th = doc.heightOfString(text, { width: bw - 55, fontSize: 10 });
    const bh = Math.max(th + 24, 44);
    doc.roundedRect(bx, y0, bw, bh, 6).fill(bg);
    doc.roundedRect(bx, y0, 3.5, bh, 2).fill(GOLD);
    doc.fontSize(14).fillColor(GOLD).text(emoji || '\u2605', bx + 14, y0 + bh / 2 - 8);
    doc.fontSize(10).fillColor(DARK).font('Helvetica')
      .text(text, bx + 38, y0 + 12, { width: bw - 55, lineGap: 3 });
    doc.y = y0 + bh + 10;
  }

  function step(n, title, desc) {
    const y = doc.y;
    doc.circle(80, y + 10, 12).fill(GOLD);
    doc.fontSize(10).fillColor(WHITE).font('Helvetica-Bold').text(n.toString(), 72, y + 5, { width: 16, align: 'center' });
    doc.fontSize(11).fillColor(DARK).font('Helvetica-Bold').text(title, 102, y + 1, { width: W - 170 });
    doc.fontSize(9.5).fillColor(GRAY).font('Helvetica').text(desc, 102, doc.y + 2, { width: W - 170, lineGap: 3 });
    doc.moveDown(0.6);
  }

  function bullet(text) {
    const y = doc.y;
    doc.circle(76, y + 5, 2.5).fill(GOLD);
    doc.fontSize(10).fillColor(GRAY).font('Helvetica').text(text, 88, y, { width: W - 158, lineGap: 2 });
    doc.moveDown(0.2);
  }

  function rbullet(text) {
    const y = doc.y;
    doc.circle(76, y + 5, 2.5).fill(RED);
    doc.fontSize(10).fillColor(GRAY).font('Helvetica').text(text, 88, y, { width: W - 158, lineGap: 2 });
    doc.moveDown(0.2);
  }

  function check(text) {
    const y = doc.y;
    doc.roundedRect(76, y + 1, 11, 11, 2).strokeColor(GOLD).lineWidth(0.8).stroke();
    doc.fontSize(10).fillColor(DARK).font('Helvetica').text(text, 95, y + 1, { width: W - 165, lineGap: 2 });
    doc.moveDown(0.3);
  }

  function weekH(t) {
    doc.roundedRect(60, doc.y, W - 120, 21, 4).fill(GOLD);
    doc.fontSize(10).fillColor(WHITE).font('Helvetica-Bold').text(t, 72, doc.y + 5);
    doc.y += 27;
  }

  function decoLine() {
    const y = doc.y + 5;
    doc.rect(W / 2 - 30, y, 60, 1.5).fill(GOLD);
    doc.circle(W / 2 - 38, y + 0.75, 2).fill(GOLD);
    doc.circle(W / 2 + 38, y + 0.75, 2).fill(GOLD);
    doc.y = y + 14;
  }

  // ===== PAGE 1 : COVER =====
  np(DARK);
  // Clean elegant cover
  doc.rect(45, 45, W - 90, 1.5).fill(GOLD);
  doc.rect(45, H - 46.5, W - 90, 1.5).fill(GOLD);
  doc.rect(45, 45, 1.5, H - 90).fill('rgba(201,169,110,0.3)');
  doc.rect(W - 46.5, 45, 1.5, H - 90).fill('rgba(201,169,110,0.3)');
  [[45,45],[W-60,45],[45,H-60],[W-60,H-60]].forEach(([cx,cy]) => {
    doc.rect(cx, cy, 15, 1.5).fill(GOLD); doc.rect(cx, cy, 1.5, 15).fill(GOLD);
  });

  doc.circle(W / 2, 195, 50).lineWidth(1).strokeColor(GOLD).stroke();
  doc.circle(W / 2, 195, 42).lineWidth(0.4).strokeColor('#555').stroke();
  doc.fontSize(7).fillColor(GOLD).font('Helvetica').text('L U M E A', 0, 191, { align: 'center', characterSpacing: 3 });
  doc.fontSize(5.5).fillColor('#888').text('S K I N C A R E', 0, 202, { align: 'center', characterSpacing: 2 });

  doc.y = 290;
  doc.fontSize(28).fillColor(WHITE).font('Helvetica-Bold').text('Routine Peau', 60, 290, { width: W - 120, align: 'center' });
  doc.fontSize(32).fillColor(GOLD).font('Helvetica-BoldOblique').text('Parfaite', 60, 325, { width: W - 120, align: 'center' });
  doc.fontSize(28).fillColor(WHITE).font('Helvetica-Bold').text('30 Jours', 60, 365, { width: W - 120, align: 'center' });

  doc.rect(W / 2 - 30, 405, 60, 2).fill(GOLD);
  doc.fontSize(10).fillColor('#CCC').font('Helvetica')
    .text('Le guide complet pour transformer', 60, 420, { width: W - 120, align: 'center' })
    .text('votre peau en 30 jours', 60, 434, { width: W - 120, align: 'center' });

  const badgeY = 465;
  ['Acc\u00e8s \u00e0 vie', 'Quiz exclusif', '5 Masques DIY'].forEach((b, i) => {
    const bx = 141 + i * 115;
    doc.roundedRect(bx, badgeY, 100, 24, 12).strokeColor(GOLD).lineWidth(0.6).stroke();
    doc.fontSize(8.5).fillColor(GOLD).font('Helvetica').text(b, bx, badgeY + 7, { width: 100, align: 'center' });
  });
  doc.fontSize(9).fillColor(GOLD).text('Par les experts LUMEA  \u2022  \u00c9dition 2025  \u2022  Canada', 60, 510, { width: W - 120, align: 'center' });

  // ===== PAGE 2 : TABLE DES MATI\u00c8RES =====
  np(CREAM); banner('Table des Mati\u00e8res', 'Votre parcours vers une peau parfaite'); footer();
  doc.y = 158;
  [['01','Introduction','Votre peau m\u00e9rite le meilleur'],['02','Quiz : Type de Peau','Identifiez votre type en 5 questions'],
   ['03','Les 5 Piliers','Les fondamentaux essentiels'],['04','Routine du Matin','5 \u00e9tapes en 5 minutes'],
   ['05','Routine du Soir','R\u00e9paration et actifs puissants'],['06','Ingr\u00e9dients Miracles','8 actifs prouv\u00e9s scientifiquement'],
   ['07','Masques Maison','5 recettes avec vos ingr\u00e9dients'],['08','Alimentation Beaut\u00e9','Nourrir sa peau de l\u2019int\u00e9rieur'],
   ['09','Erreurs Fatales','11 erreurs \u00e0 \u00e9viter absolument'],['10','Calendrier 30 Jours','Plan d\u2019action jour par jour'],
   ['11','FAQ & Bonus','R\u00e9ponses et conseils']].forEach(([n, t, s]) => {
    const y = doc.y;
    doc.roundedRect(60, y, W - 120, 38, 5).fill(WHITE);
    doc.circle(84, y + 19, 12).fill(GOLD);
    doc.fontSize(9).fillColor(WHITE).font('Helvetica-Bold').text(n, 76, y + 14, { width: 16, align: 'center' });
    doc.fontSize(11).fillColor(DARK).font('Helvetica-Bold').text(t, 106, y + 7, { width: 280 });
    doc.fontSize(8.5).fillColor(GRAY).font('Helvetica').text(s, 106, y + 22, { width: 280 });
    doc.fontSize(10).fillColor(GOLD).text('\u2192', W - 82, y + 12);
    doc.y = y + 43;
  });

  // ===== PAGE 3 : INTRODUCTION =====
  np(CREAM); banner('Introduction', 'Votre peau m\u00e9rite le meilleur'); footer();
  doc.y = 150;
  doc.fontSize(11).fillColor(DARK).font('Helvetica-Bold')
    .text('F\u00e9licitations pour votre d\u00e9cision d\u2019investir dans votre peau !', 60, doc.y, { width: W - 120 });
  doc.moveDown(0.4);
  doc.fontSize(10).fillColor(GRAY).font('Helvetica')
    .text('Ce guide est le fruit de 5 ann\u00e9es de recherche en dermatologie et de collaboration avec des experts en soins de la peau au Canada. Dans les 30 prochains jours, vous allez d\u00e9couvrir une m\u00e9thode \u00e9prouv\u00e9e qui a d\u00e9j\u00e0 aid\u00e9 plus de 15 000 femmes \u00e0 transformer leur peau.', 60, doc.y, { width: W - 120, lineGap: 4 });
  doc.moveDown(0.6);
  tip('\u00ab La beaut\u00e9 de la peau commence par une routine adapt\u00e9e et constante. Pas de produits miracles, mais une m\u00e9thode qui fonctionne. \u00bb', '\u201C', LGOLD);
  decoLine();
  doc.fontSize(13).fillColor(DARK).font('Helvetica-Bold').text('Ce que vous allez apprendre', 60, doc.y); doc.moveDown(0.5);
  ['Comment identifier votre type de peau exactement','La routine matin et soir adapt\u00e9e \u00e0 VOS besoins',
   'Les ingr\u00e9dients qui fonctionnent vraiment (et ceux \u00e0 \u00e9viter)','Des recettes de masques maison simples et efficaces',
   'Un calendrier jour par jour pour les 30 prochains jours','Les erreurs que 90% des femmes font (et comment les corriger)'].forEach(p => bullet(p));

  // ===== PAGE 4 : QUIZ =====
  np(CREAM); banner('Quiz Exclusif', 'Quel est votre type de peau ?'); footer();
  doc.y = 148;
  doc.fontSize(10).fillColor(GRAY).font('Helvetica')
    .text('R\u00e9pondez \u00e0 ces 5 questions pour d\u00e9couvrir votre type de peau et adapter votre routine.', 60, doc.y, { width: W - 120, lineGap: 3 });
  doc.moveDown(0.6);

  [{q:'Le matin au r\u00e9veil, votre peau est :',o:['A) Confortable, ni grasse ni s\u00e8che','B) Tendue, avec des tiraillements','C) Brillante, surtout sur le front et le nez','D) Brillante zone T, s\u00e8che sur les joues','E) Rouge, avec des sensations d\u2019inconfort']},
   {q:'En milieu de journ\u00e9e, votre peau :',o:['A) Reste la m\u00eame qu\u2019au matin','B) Semble encore plus s\u00e8che','C) Brille partout','D) Brille sur le nez et le front seulement','E) Pr\u00e9sente des rougeurs ou picotements']},
   {q:'Quand vous appliquez un nouveau produit :',o:['A) Aucune r\u00e9action particuli\u00e8re','B) Votre peau \u00ab avale \u00bb tout rapidement','C) Votre peau devient plus grasse','D) \u00c7a d\u00e9pend de la zone du visage','E) Vous avez souvent des r\u00e9actions']},
   {q:'Vos pores sont :',o:['A) Fins et peu visibles','B) Tr\u00e8s fins, presque invisibles','C) Dilat\u00e9s et visibles','D) Dilat\u00e9s sur le nez, fins sur les joues','E) Fins mais votre peau est r\u00e9active']},
   {q:'En hiver, votre peau :',o:['A) Va bien, pas de changement majeur','B) Desquame et tiraille beaucoup','C) Reste grasse','D) Les joues deviennent tr\u00e8s s\u00e8ches','E) Devient tr\u00e8s sensible au froid']}
  ].forEach((item, i) => {
    if (doc.y > H - 160) { np(CREAM); banner('Quiz (suite)', ''); footer(); doc.y = 148; }
    const y = doc.y;
    doc.circle(77, y + 7, 10).fill(GOLD);
    doc.fontSize(9).fillColor(WHITE).font('Helvetica-Bold').text((i+1).toString(), 72, y + 3, { width: 10, align: 'center' });
    doc.fontSize(10.5).fillColor(DARK).font('Helvetica-Bold').text(item.q, 96, y, { width: W - 170 });
    doc.moveDown(0.2);
    item.o.forEach(o => { doc.fontSize(9).fillColor(GRAY).font('Helvetica').text(o, 96, doc.y, { width: W - 170 }); doc.moveDown(0.1); });
    doc.moveDown(0.35);
  });

  doc.moveDown(0.2);
  const ry = doc.y;
  doc.roundedRect(60, ry, W - 120, 95, 6).fill(LGOLD);
  doc.roundedRect(60, ry, 3.5, 95, 2).fill(GOLD);
  doc.fontSize(11).fillColor(DARK).font('Helvetica-Bold').text('\u2605 R\u00e9sultats :', 75, ry + 8);
  doc.fontSize(9).fillColor(GRAY).font('Helvetica');
  ['Majorit\u00e9 de A = Peau Normale \u2014 Routine d\u2019entretien et pr\u00e9vention',
   'Majorit\u00e9 de B = Peau S\u00e8che \u2014 Textures riches + acide hyaluronique',
   'Majorit\u00e9 de C = Peau Grasse \u2014 Textures l\u00e9g\u00e8res + niacinamide + BHA',
   'Majorit\u00e9 de D = Peau Mixte \u2014 Adapter les soins par zone du visage',
   'Majorit\u00e9 de E = Peau Sensible \u2014 Formules douces, sans parfum'
  ].forEach(r => { doc.text(r, 75, doc.y + 1, { width: W - 155 }); });

  // ===== PAGE 5 : 5 PILIERS =====
  np(CREAM); banner('Chapitre 1', 'Les 5 piliers d\u2019une peau parfaite'); footer();
  doc.y = 148;
  [{n:'01',t:'NETTOYAGE',d:'Un nettoyage doux matin et soir. Massez d\u00e9licatement en mouvements circulaires pendant 60 secondes. Jamais d\u2019eau chaude.'},
   {n:'02',t:'HYDRATATION',d:'M\u00eame les peaux grasses ont besoin d\u2019hydratation ! Renforcez la barri\u00e8re cutan\u00e9e. Appliquez toujours sur peau humide.'},
   {n:'03',t:'PROTECTION SOLAIRE',d:'SPF 30+ chaque matin, m\u00eame en hiver. Les UV causent 80% du vieillissement cutan\u00e9. C\u2019est le produit anti-\u00e2ge #1.'},
   {n:'04',t:'NUTRITION',d:'Antioxydants, om\u00e9ga-3, et 2L d\u2019eau par jour. Votre peau refl\u00e8te ce que vous mangez.'},
   {n:'05',t:'SOMMEIL',d:'7-8 heures de sommeil. Taie d\u2019oreiller en soie pour r\u00e9duire frictions et rides. La peau se r\u00e9g\u00e9n\u00e8re la nuit.'}
  ].forEach(p => {
    const y = doc.y, ch = 65;
    doc.roundedRect(60, y, W - 120, ch, 7).fill(WHITE);
    doc.roundedRect(60, y, W - 120, ch, 7).strokeColor('#E8E0D4').lineWidth(0.5).stroke();
    doc.fontSize(24).fillColor(GOLD).font('Helvetica-Bold').text(p.n, 72, y + 7);
    doc.fontSize(11).fillColor(DARK).font('Helvetica-Bold').text(p.t, 115, y + 9, { characterSpacing: 1 });
    doc.fontSize(9.5).fillColor(GRAY).font('Helvetica').text(p.d, 115, y + 26, { width: W - 200, lineGap: 3 });
    doc.y = y + ch + 5;
  });
  tip('La constance est plus importante que le produit ! Une routine simple suivie chaque jour bat une routine complexe suivie 2 fois par semaine.', '\u2605', LGOLD);

  // ===== PAGE 6 : ROUTINE MATIN =====
  np(CREAM); banner('Chapitre 2', 'Routine du matin \u2014 5 \u00e9tapes en 5 minutes'); footer();
  doc.y = 145;

  doc.fontSize(10).fillColor(GRAY).font('Helvetica')
    .text('Votre routine du matin prot\u00e8ge votre peau pour la journ\u00e9e. Simple, rapide, efficace.', 60, doc.y, { width: W - 120, lineGap: 3 });
  doc.moveDown(0.5);
  [['Nettoyage doux (1 min)','Nettoyant sans sulfate. Massez en cercles, rincez \u00e0 l\u2019eau ti\u00e8de. Jamais d\u2019eau chaude.'],
   ['Tonique hydratant (30 sec)','Sans alcool, appliquez avec les mains. Tapotez d\u00e9licatement. Pr\u00e9pare la peau.'],
   ['S\u00e9rum Vitamine C (1 min)','Votre meilleur alli\u00e9 \u00e9clat + anti-\u00e2ge. 3-4 gouttes sur peau humide.'],
   ['Cr\u00e8me hydratante (1 min)','Texture l\u00e9g\u00e8re (grasse) ou riche (s\u00e8che). Mouvements ascendants.'],
   ['SPF 30+ obligatoire (1 min)','LA \u00e9tape la plus importante ! 2 doigts de produit, 15 min avant exposition.']
  ].forEach((s,i) => step(i+1, s[0], s[1]));
  tip('Ordre d\u2019application : toujours du plus l\u00e9ger au plus \u00e9pais. S\u00e9rum avant cr\u00e8me !', '\u2605', BLUE);

  // ===== PAGE 7 : ROUTINE SOIR =====
  np(CREAM); banner('Chapitre 3', 'Routine du soir \u2014 R\u00e9paration nocturne'); footer();
  doc.y = 145;

  doc.fontSize(10).fillColor(GRAY).font('Helvetica')
    .text('La nuit, votre peau se r\u00e9pare. C\u2019est le moment d\u2019utiliser vos actifs les plus puissants.', 60, doc.y, { width: W - 120, lineGap: 3 });
  doc.moveDown(0.5);
  [['Double nettoyage (2 min)','Huile/baume puis nettoyant. Dissout maquillage + SPF. Peau propre garantie.'],
   ['Exfoliation 2x/semaine (2 min)','AHA pour peaux s\u00e8ches. BHA pour peaux grasses. Jamais plus de 2x/semaine.'],
   ['S\u00e9rum de nuit (1 min)','R\u00e9tinol = anti-\u00e2ge #1. Commencez \u00e0 0.3%, augmentez progressivement.'],
   ['Contour des yeux (30 sec)','Peau 5x plus fine. Caf\u00e9ine ou r\u00e9tinol. Tapotez avec l\u2019annulaire.'],
   ['Cr\u00e8me de nuit ou huile (1 min)','Plus riche que le jour. Jojoba ou rose musqu\u00e9e. R\u00e9g\u00e9n\u00e9ration 22h-2h.']
  ].forEach((s,i) => step(i+1, s[0], s[1]));
  tip('Ne combinez JAMAIS r\u00e9tinol + AHA/BHA le m\u00eame soir. Alternez un soir sur deux.', '\u26A0', PINK);

  // ===== PAGE 8 : INGREDIENTS =====
  np(CREAM); banner('Chapitre 4', 'Les 8 ingr\u00e9dients miracles'); footer();
  doc.y = 145;
  doc.fontSize(10).fillColor(GRAY).font('Helvetica')
    .text('Ces actifs sont prouv\u00e9s scientifiquement. Apprenez \u00e0 les reconna\u00eetre sur les \u00e9tiquettes.', 60, doc.y, { width: W - 120, lineGap: 3 });
  doc.moveDown(0.5);

  function ingCard(name, when, desc, bg) {
    const y = doc.y, th = doc.heightOfString(desc, { width: W - 180, fontSize: 9.5 }), ch = th + 38;
    doc.roundedRect(60, y, W - 120, ch, 6).fill(bg);
    doc.fontSize(11).fillColor(DARK).font('Helvetica-Bold').text(name, 75, y + 9);
    const bw = doc.widthOfString(when, { fontSize: 8 }) + 14;
    doc.roundedRect(W - 70 - bw, y + 7, bw, 17, 8).fill(GOLD);
    doc.fontSize(8).fillColor(WHITE).font('Helvetica-Bold').text(when, W - 70 - bw + 7, y + 11, { width: bw - 14 });
    doc.fontSize(9.5).fillColor(GRAY).font('Helvetica').text(desc, 75, y + 27, { width: W - 180, lineGap: 2 });
    doc.y = y + ch + 5;
  }

  ingCard('Vitamine C', 'Matin', '\u00c9clat, anti-taches, antioxydant puissant. Concentration 10-20%. Forme L-ascorbique = la plus efficace.', GREEN);
  ingCard('R\u00e9tinol', 'Soir', 'Anti-\u00e2ge #1 au monde. Stimule le renouvellement cellulaire. Commencer 2x/semaine puis augmenter progressivement.', PINK);
  ingCard('Acide hyaluronique', 'Matin+Soir', 'Retient 1000x son poids en eau. Appliquer sur peau humide obligatoirement pour maximiser l\u2019hydratation.', BLUE);
  ingCard('Niacinamide (B3)', 'Matin+Soir', 'Resserre les pores, contr\u00f4le le s\u00e9bum, unifie le teint. Concentration 5-10%. Compatible avec tous les actifs.', LGOLD);

  // ===== PAGE 9 : INGREDIENTS SUITE =====
  np(CREAM); banner('Chapitre 4 (suite)', 'Ingr\u00e9dients miracles'); footer();
  doc.y = 148;
  ingCard('AHA (Acide glycolique)', '2x/sem soir', 'Exfoliant chimique pour peaux s\u00e8ches/ternes. R\u00e9v\u00e8le un teint lumineux. SPF obligatoire le lendemain.', GREEN);
  ingCard('BHA (Acide salicylique)', '2x/sem soir', 'P\u00e9n\u00e8tre dans les pores pour les nettoyer en profondeur. Id\u00e9al peaux grasses/acn\u00e9iques. 1-2%.', BLUE);
  ingCard('Peptides', 'Matin+Soir', 'Stimulent la production de collag\u00e8ne naturel. Compl\u00e9ment id\u00e9al du r\u00e9tinol. Peptides de cuivre ou Matrixyl.', LGOLD);
  ingCard('SPF (Filtres solaires)', 'Matin', 'SPF 30 minimum. R\u00e9appliquer toutes les 2h. Le geste anti-\u00e2ge le plus sous-estim\u00e9 au monde.', PINK);
  tip('Un s\u00e9rum vitamine C \u00e0 20$ peut \u00eatre aussi efficace qu\u2019un \u00e0 100$. Lisez les \u00e9tiquettes (INCI), pas les publicit\u00e9s !', '\u2605', LGOLD);

  // ===== PAGE 10-11 : MASQUES =====
  np(CREAM); banner('Chapitre 5', '5 recettes de masques maison'); footer();
  doc.y = 145;
  doc.fontSize(10).fillColor(GRAY).font('Helvetica')
    .text('Des masques efficaces avec des ingr\u00e9dients de votre cuisine. \u00c0 faire 1 \u00e0 2 fois par semaine.', 60, doc.y, { width: W - 120, lineGap: 3 });
  doc.moveDown(0.5);

  function mask(n, name, skin, ing, steps, bg) {
    if (doc.y > H - 140) { np(CREAM); banner('Masques (suite)', 'Recettes naturelles'); footer(); doc.y = 148; }
    const y = doc.y;
    const ih = doc.heightOfString(ing, { width: W - 195, fontSize: 9.5 });
    const sh = doc.heightOfString(steps, { width: W - 195, fontSize: 9.5 });
    const ch = ih + sh + 72;
    doc.roundedRect(60, y, W - 120, ch, 7).fill(bg);
    doc.circle(81, y + 17, 13).fill(GOLD);
    doc.fontSize(11).fillColor(WHITE).font('Helvetica-Bold').text(n.toString(), 75, y + 12, { width: 12, align: 'center' });
    doc.fontSize(11).fillColor(DARK).font('Helvetica-Bold').text(name, 103, y + 9, { width: W - 195 });
    doc.fontSize(8).fillColor(GOLD).font('Helvetica-Oblique').text('Pour : ' + skin, 103, y + 25);
    doc.fontSize(9.5).fillColor(DARK).font('Helvetica-Bold').text('Ingr\u00e9dients :', 75, y + 40);
    doc.fontSize(9.5).fillColor(GRAY).font('Helvetica').text(ing, 88, doc.y + 1, { width: W - 195, lineGap: 2 });
    doc.moveDown(0.2);
    doc.fontSize(9.5).fillColor(DARK).font('Helvetica-Bold').text('Pr\u00e9paration :', 75);
    doc.fontSize(9.5).fillColor(GRAY).font('Helvetica').text(steps, 88, doc.y + 1, { width: W - 195, lineGap: 2 });
    doc.y = y + ch + 7;
  }

  mask(1, 'Masque \u00c9clat au Miel & Curcuma', 'Tous types de peau',
    '2 c. \u00e0 soupe de miel brut + \u00bd c. \u00e0 th\u00e9 de curcuma + 1 c. \u00e0 soupe de yogourt nature',
    'M\u00e9langez tout. Appliquez sur visage propre, 15-20 min. Rincez \u00e0 l\u2019eau ti\u00e8de. Le curcuma illumine, le miel hydrate.', LGOLD);
  mask(2, 'Masque Purifiant au Charbon', 'Peaux grasses/mixtes',
    '1 capsule de charbon actif + 1 c. \u00e0 soupe d\u2019argile verte + eau de rose',
    'M\u00e9langez pour former une p\u00e2te. Couche fine, 10 min max. Ne laissez JAMAIS s\u00e9cher compl\u00e8tement. Rincez.', BLUE);
  mask(3, 'Masque Hydratant \u00e0 l\u2019Avocat', 'Peaux s\u00e8ches/d\u00e9shydrat\u00e9es',
    '\u00bd avocat m\u00fbr + 1 c. \u00e0 soupe de miel + quelques gouttes d\u2019huile de jojoba',
    '\u00c9crasez l\u2019avocat, m\u00e9langez. Couche \u00e9paisse, 20 min. Peau repulp\u00e9e et nourrie en profondeur.', GREEN);
  mask(4, 'Masque Anti-\u00c2ge au Blanc d\u2019\u0152uf', 'Peaux matures',
    '1 blanc d\u2019\u0153uf + 1 c. \u00e0 soupe de jus de citron + 1 c. \u00e0 th\u00e9 de miel',
    'Battez le blanc. Ajoutez citron + miel. 2 couches, 15 min. Effet tenseur imm\u00e9diat !', PINK);
  mask(5, 'Masque Apaisant Aloe Vera', 'Peaux sensibles/irrit\u00e9es',
    '2 c. \u00e0 soupe gel d\u2019aloe vera pur + 1 c. \u00e0 soupe eau de concombre + 2 gouttes huile de camomille',
    'M\u00e9langez et gardez au frigo 10 min. Couche \u00e9paisse, 20 min. Id\u00e9al apr\u00e8s irritation ou coup de soleil.', '#F0FFF8');

  // ===== PAGE 12 : ALIMENTATION =====
  np(CREAM); banner('Chapitre 6', 'Alimentation & beaut\u00e9 de la peau'); footer();
  doc.y = 145;
  doc.fontSize(10).fillColor(GRAY).font('Helvetica')
    .text('Ce que vous mangez a un impact direct sur votre peau. Voici les aliments \u00e0 privil\u00e9gier et ceux \u00e0 limiter.', 60, doc.y, { width: W - 120, lineGap: 3 });
  doc.moveDown(0.6);

  doc.roundedRect(60, doc.y, W - 120, 19, 4).fill(DGREEN);
  doc.fontSize(10).fillColor(WHITE).font('Helvetica-Bold').text('\u2713  ALIMENTS \u00c0 PRIVIL\u00c9GIER', 72, doc.y + 4); doc.y += 24;
  ['Saumon, sardines (om\u00e9ga-3 anti-inflammatoires)','Baies : myrtilles, framboises (antioxydants puissants)',
   'Avocat (graisses saines pour la souplesse)','Patates douces, carottes (b\u00eata-carot\u00e8ne = vitamine A)',
   'Noix, amandes, graines de lin (vitamine E + zinc)','Th\u00e9 vert (polyph\u00e9nols anti-\u00e2ge)',
   '\u00c9pinards, kale (vitamines A, C, K et fer)','Eau : 2L/jour minimum (hydratation cellulaire)'].forEach(f => bullet(f));

  doc.moveDown(0.5);
  doc.roundedRect(60, doc.y, W - 120, 19, 4).fill(RED);
  doc.fontSize(10).fillColor(WHITE).font('Helvetica-Bold').text('\u2717  ALIMENTS \u00c0 LIMITER', 72, doc.y + 4); doc.y += 24;
  ['Sucre raffin\u00e9 \u2014 acc\u00e9l\u00e8re le vieillissement (glycation)','Produits laitiers \u2014 peuvent aggraver l\u2019acn\u00e9',
   'Alcool \u2014 d\u00e9shydrate la peau, dilate les vaisseaux','Aliments ultra-transform\u00e9s \u2014 inflammatoires',
   'Exc\u00e8s de sel \u2014 r\u00e9tention d\u2019eau, poches sous les yeux'].forEach(f => rbullet(f));
  doc.moveDown(0.5);
  tip('Buvez un verre d\u2019eau ti\u00e8de avec du citron chaque matin \u00e0 jeun. Votre peau vous remerciera d\u00e8s la premi\u00e8re semaine !', '\u2605', LGOLD);

  // ===== PAGE 13 : ERREURS =====
  np(CREAM); banner('Chapitre 7', '11 erreurs fatales \u00e0 \u00e9viter'); footer();
  doc.y = 148;
  [['Dormir avec son maquillage','Obstrue les pores, cause acn\u00e9 et vieillissement pr\u00e9matur\u00e9.'],
   ['Utiliser de l\u2019eau chaude','D\u00e9truit le film hydrolipidique. Toujours ti\u00e8de ou froide.'],
   ['Changer de routine chaque semaine','Un produit a besoin de 4-6 semaines pour montrer ses effets.'],
   ['Oublier le cou et le d\u00e9collet\u00e9','Ces zones vieillissent aussi vite que le visage. \u00c9tendez votre routine.'],
   ['Exfolier tous les jours','D\u00e9truit la barri\u00e8re cutan\u00e9e. Maximum 2 fois par semaine.'],
   ['Appliquer le r\u00e9tinol le matin','Il est photosensibilisant. Uniquement le soir, jamais le matin.'],
   ['M\u00e9langer r\u00e9tinol + AHA/BHA','Ne jamais combiner le m\u00eame soir. Alternez un soir sur deux.'],
   ['Oublier le SPF','80% du vieillissement visible est caus\u00e9 par les UV. Pas n\u00e9gociable.'],
   ['Toucher son visage','Transfert de bact\u00e9ries = boutons. Nettoyez aussi votre t\u00e9l\u00e9phone.'],
   ['Utiliser des produits p\u00e9rim\u00e9s','V\u00e9rifiez la PAO (P\u00e9riode Apr\u00e8s Ouverture) sur chaque produit.'],
   ['Manquer de r\u00e9gularit\u00e9','La constance est plus importante que le produit le plus cher.']
  ].forEach(([t, d], i) => {
    if (doc.y > H - 65) { np(CREAM); banner('Erreurs (suite)', ''); footer(); doc.y = 148; }
    const y = doc.y, ch = 40;
    doc.roundedRect(60, y, W - 120, ch, 5).fill(i % 2 === 0 ? WHITE : '#FFF8F8');
    doc.circle(81, y + ch / 2, 10).fill(RED);
    doc.fontSize(8.5).fillColor(WHITE).font('Helvetica-Bold').text((i+1).toString(), 74, y + ch/2 - 4, { width: 14, align: 'center' });
    doc.fontSize(10).fillColor(DARK).font('Helvetica-Bold').text(t, 100, y + 6, { width: W - 190 });
    doc.fontSize(9).fillColor(GRAY).font('Helvetica').text(d, 100, y + 21, { width: W - 190 });
    doc.y = y + ch + 4;
  });

  // ===== PAGE 14-15 : CALENDRIER =====
  np(CREAM); banner('Chapitre 8', 'Plan d\u2019action 30 jours'); footer();
  doc.y = 148;
  doc.fontSize(10).fillColor(GRAY).font('Helvetica')
    .text('Cochez chaque \u00e9tape accomplie. La r\u00e9gularit\u00e9 est la cl\u00e9 du succ\u00e8s !', 60, doc.y, { width: W - 120, lineGap: 3 });
  doc.moveDown(0.5);
  weekH('SEMAINE 1 : Pr\u00e9paration');
  ['Jour 1-3 : Nettoyage matin + soir + hydratant uniquement. Observez votre peau.',
   'Jour 4 : Ajoutez le s\u00e9rum vitamine C le matin.',
   'Jour 5 : Ajoutez la cr\u00e8me solaire SPF 30+ le matin.',
   'Jour 6 : Premi\u00e8re exfoliation douce le soir (AHA ou BHA).',
   'Jour 7 : Jour de repos \u2014 masque hydratant maison. \u00c9valuez.'].forEach(d => check(d));
  doc.moveDown(0.3);
  weekH('SEMAINE 2 : Construction');
  ['Jour 8-10 : Routine de base + contour des yeux le soir.',
   'Jour 11 : Introduisez le r\u00e9tinol (faible dose) 1x cette semaine.',
   'Jour 12 : Deuxi\u00e8me exfoliation de la semaine.',
   'Jour 13 : Masque purifiant au charbon.',
   'Jour 14 : \u00c9valuez. Moins de brillance ? Plus d\u2019\u00e9clat ? Ajustez.'].forEach(d => check(d));

  np(CREAM); banner('Calendrier (suite)', 'Semaines 3 et 4'); footer();
  doc.y = 148;
  weekH('SEMAINE 3 : Intensification');
  ['Jour 15-17 : R\u00e9tinol 2x par semaine. Surveillez la tol\u00e9rance.',
   'Jour 18 : Essayez le double nettoyage le soir.',
   'Jour 19 : Masque \u00e9clat au miel et curcuma.',
   'Jour 20 : Augmentez la concentration vitamine C si tol\u00e9r\u00e9e.',
   'Jour 21 : Photo de progression ! Comparez avec le jour 1.'].forEach(d => check(d));
  doc.moveDown(0.3);
  weekH('SEMAINE 4 : Transformation');
  ['Jour 22-25 : Routine compl\u00e8te install\u00e9e. Maintenez la r\u00e9gularit\u00e9.',
   'Jour 26 : Masque anti-\u00e2ge ou hydratant selon votre besoin.',
   'Jour 27 : \u00c9valuez vos r\u00e9sultats. Quels produits sont vos favoris ?',
   'Jour 28-29 : Affinez votre routine d\u00e9finitive.',
   'Jour 30 : Photo finale ! C\u00e9l\u00e9brez votre transformation !'].forEach(d => check(d));
  doc.moveDown(0.6);
  tip('Prenez une photo de votre peau le Jour 1 et le Jour 30, m\u00eame \u00e9clairage. Vous serez impressionn\u00e9e !', '\u2605', LGOLD);

  // ===== PAGE 16 : FAQ =====
  np(CREAM); banner('FAQ', 'Questions fr\u00e9quentes & conseils bonus'); footer();
  doc.y = 148;
  [['Combien de temps avant de voir des r\u00e9sultats ?','Premiers changements en 7-14 jours. R\u00e9sultats significatifs (taches, rides, texture) en 4-8 semaines avec une routine constante.'],
   ['Puis-je utiliser ces conseils si je suis enceinte ?','\u00c9vitez le r\u00e9tinol et les AHA/BHA forts. Consultez votre dermatologue. Le reste du guide est parfaitement compatible.'],
   ['Dois-je acheter des produits chers ?','Non ! L\u2019important c\u2019est les ingr\u00e9dients, pas la marque. Un s\u00e9rum \u00e0 20$ peut \u00eatre aussi efficace qu\u2019un \u00e0 100$.'],
   ['Comment savoir si un produit ne me convient pas ?','Test sur une petite zone 24h avant. Si rougeur ou irritation, arr\u00eatez. L\u00e9ger picotement avec AHA = normal.'],
   ['Le masque au citron est-il dangereux ?','Le citron pur est trop acide (pH 2). Dans nos recettes, il est dilu\u00e9 avec miel et blanc d\u2019\u0153uf. Ne jamais appliquer pur.']
  ].forEach(([q, a]) => {
    if (doc.y > H - 100) { np(CREAM); banner('FAQ (suite)', ''); footer(); doc.y = 148; }
    const y = doc.y, ah = doc.heightOfString('R : ' + a, { width: W - 150, fontSize: 9.5 }), ch = ah + 35;
    doc.roundedRect(60, y, W - 120, ch, 5).fill(WHITE);
    doc.fontSize(10.5).fillColor(DARK).font('Helvetica-Bold').text('Q :  ' + q, 72, y + 8, { width: W - 150 });
    doc.fontSize(9.5).fillColor(GRAY).font('Helvetica').text('R :  ' + a, 72, y + 24, { width: W - 150, lineGap: 2 });
    doc.y = y + ch + 6;
  });

  // ===== DERNIERE PAGE : MERCI =====
  np(DARK);
  doc.rect(45, 45, W - 90, 1.5).fill(GOLD);
  doc.rect(45, H - 45, W - 90, 1.5).fill(GOLD);
  [[45,45],[W-60,45],[45,H-60],[W-60,H-60]].forEach(([cx,cy]) => {
    doc.rect(cx, cy, 15, 1.5).fill(GOLD); doc.rect(cx, cy, 1.5, 15).fill(GOLD);
  });
  doc.circle(W / 2, 220, 45).lineWidth(0.8).strokeColor(GOLD).stroke();
  doc.fontSize(10).fillColor(GOLD).font('Helvetica').text('L U M E A', 0, 210, { align: 'center', characterSpacing: 5 });
  doc.y = 310;
  doc.fontSize(32).fillColor(WHITE).font('Helvetica-Bold').text('Merci !', { align: 'center' });
  doc.moveDown(0.6);
  doc.fontSize(14).fillColor(GOLD).font('Helvetica').text('Votre peau vous remerciera.', { align: 'center' });
  doc.moveDown(0.3);
  doc.fontSize(11).fillColor('#BBB').font('Helvetica')
    .text('Commencez d\u00e8s aujourd\u2019hui et prenez', { align: 'center' })
    .text('votre photo du Jour 1 !', { align: 'center' });
  doc.moveDown(2.5);
  doc.fontSize(10).fillColor(GOLD).text('lumea-boutique.onrender.com', { align: 'center' });
  doc.moveDown(1.5);
  doc.fontSize(8).fillColor('#555')
    .text('Ce guide est prot\u00e9g\u00e9 par le droit d\u2019auteur. Toute reproduction est interdite.', { align: 'center' });
  doc.text('\u00A9 2025 LUMEA Canada. Tous droits r\u00e9serv\u00e9s.', { align: 'center' });

  doc.end();
  return new Promise((r, j) => { stream.on('finish', () => { console.log('Guide PDF generated:', outputPath); r(outputPath); }); stream.on('error', j); });
}

if (require.main === module) generateGuide().then(() => console.log('Done!')).catch(console.error);
module.exports = { generateGuide };
