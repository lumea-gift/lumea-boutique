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
  const GOLD = '#C9A96E', DARK = '#1A1A2E', CREAM = '#FBF8F4', WHITE = '#FFFFFF';
  const GRAY = '#5A5A6E', LGOLD = '#F5EFE3', PINK = '#FFF0F0', GREEN = '#F0FFF4';
  const BLUE = '#F0F4FF', RED = '#D4445C', DGREEN = '#2D9F5C';
  let pg = 0;

  function np(bg) { if (pg > 0) doc.addPage(); pg++; if (bg) doc.rect(0, 0, W, H).fill(bg); }
  function footer() {
    doc.rect(60, H - 48, W - 120, 0.5).fill('#E0D8CC');
    doc.fontSize(7).fillColor('#AAAAAA').font('Helvetica')
      .text('LUMEA  \u2022  Guide Routine Peau Parfaite 30 Jours  \u2022  \u00A9 2025 LUMEA Canada', 60, H - 38, { width: W - 120, align: 'center' });
    doc.fontSize(8).fillColor(GOLD).text(pg.toString(), W - 55, H - 38, { width: 20, align: 'right' });
  }
  function corners() {
    var M = 45, cL = 20, cT = 2.5;
    doc.rect(M, M, cL, cT).fill(GOLD); doc.rect(M, M, cT, cL).fill(GOLD);
    doc.rect(W-M-cL, M, cL, cT).fill(GOLD); doc.rect(W-M-cT, M, cT, cL).fill(GOLD);
    doc.rect(M, H-M-cT, cL, cT).fill(GOLD); doc.rect(M, H-M-cL, cT, cL).fill(GOLD);
    doc.rect(W-M-cL, H-M-cT, cL, cT).fill(GOLD); doc.rect(W-M-cT, H-M-cL, cT, cL).fill(GOLD);
  }
  function banner(icon, title, sub) {
    doc.rect(0, 0, W, 130).fill(DARK);
    doc.rect(W / 2 - 25, 115, 50, 1).fill('rgba(201,169,110,0.3)');
    doc.rect(0, 128, W, 3).fill(GOLD);
    doc.circle(W / 2, 28, 14).fill('rgba(201,169,110,0.15)');
    doc.fontSize(14).fillColor(GOLD).font('Helvetica').text(icon, W / 2 - 7, 21, { width: 14, align: 'center' });
    doc.fontSize(22).fillColor(WHITE).font('Helvetica-Bold').text(title, 60, 50, { width: W - 120, align: 'center' });
    if (sub) doc.fontSize(11).fillColor(GOLD).font('Helvetica-Oblique').text(sub, 60, 82, { width: W - 120, align: 'center' });
    doc.y = 150;
  }
  function tip(text, emoji, bg) {
    var bx = 60, bw = W - 120, y0 = doc.y + 4;
    var th = doc.heightOfString(text, { width: bw - 55, fontSize: 10 });
    var bh = Math.max(th + 24, 44);
    doc.roundedRect(bx, y0, bw, bh, 6).fill(bg);
    doc.roundedRect(bx, y0, 3.5, bh, 2).fill(GOLD);
    doc.fontSize(14).fillColor(GOLD).text(emoji || '\u2605', bx + 14, y0 + bh / 2 - 8);
    doc.fontSize(10).fillColor(DARK).font('Helvetica').text(text, bx + 38, y0 + 12, { width: bw - 55, lineGap: 3 });
    doc.y = y0 + bh + 10;
  }
  function step(n, title, desc) {
    var y = doc.y;
    doc.circle(80, y + 10, 12).fill(GOLD);
    doc.fontSize(10).fillColor(WHITE).font('Helvetica-Bold').text(n.toString(), 72, y + 5, { width: 16, align: 'center' });
    doc.fontSize(11).fillColor(DARK).font('Helvetica-Bold').text(title, 102, y + 1, { width: W - 170 });
    doc.fontSize(9.5).fillColor(GRAY).font('Helvetica').text(desc, 102, doc.y + 2, { width: W - 170, lineGap: 3 });
    doc.moveDown(0.6);
  }
  function bullet(text) {
    var y = doc.y;
    doc.circle(76, y + 5, 2.5).fill(GOLD);
    doc.fontSize(10).fillColor(GRAY).font('Helvetica').text(text, 88, y, { width: W - 158, lineGap: 2 });
    doc.moveDown(0.2);
  }
  function rbullet(text) {
    var y = doc.y;
    doc.circle(76, y + 5, 2.5).fill(RED);
    doc.fontSize(10).fillColor(GRAY).font('Helvetica').text(text, 88, y, { width: W - 158, lineGap: 2 });
    doc.moveDown(0.2);
  }
  function check(text) {
    var y = doc.y;
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
    var y = doc.y + 5;
    doc.rect(W / 2 - 30, y, 60, 1.5).fill(GOLD);
    doc.circle(W / 2 - 38, y + 0.75, 2).fill(GOLD);
    doc.circle(W / 2 + 38, y + 0.75, 2).fill(GOLD);
    doc.y = y + 14;
  }
  function sectionBreak() {
    var y = doc.y + 8;
    doc.rect(60, y, W - 120, 0.5).fill('#E8E0D4');
    doc.y = y + 12;
  }

  // ===== PAGE 1 : COVER =====
  np(DARK);
  doc.rect(45, 45, W - 90, 1.5).fill(GOLD);
  doc.rect(45, H - 46.5, W - 90, 1.5).fill(GOLD);
  doc.rect(45, 45, 1.5, H - 90).fill('rgba(201,169,110,0.3)');
  doc.rect(W - 46.5, 45, 1.5, H - 90).fill('rgba(201,169,110,0.3)');
  corners();
  doc.circle(W / 2, 180, 40).lineWidth(1).strokeColor(GOLD).stroke();
  doc.circle(W / 2, 180, 33).lineWidth(0.4).strokeColor('#555').stroke();
  doc.fontSize(6.5).fillColor(GOLD).font('Helvetica').text('L U M E A', W / 2 - 28, 177, { width: 56, align: 'center', characterSpacing: 2 });
  doc.fontSize(5).fillColor('#888').text('S K I N C A R E', W / 2 - 28, 186, { width: 56, align: 'center', characterSpacing: 1.5 });
  doc.fontSize(28).fillColor(WHITE).font('Helvetica-Bold').text('Routine Peau', 60, 260, { width: W - 120, align: 'center' });
  doc.fontSize(34).fillColor(GOLD).font('Helvetica-BoldOblique').text('Parfaite', 60, 295, { width: W - 120, align: 'center' });
  doc.fontSize(28).fillColor(WHITE).font('Helvetica-Bold').text('30 Jours', 60, 338, { width: W - 120, align: 'center' });
  doc.rect(W / 2 - 30, 380, 60, 2).fill(GOLD);
  doc.fontSize(10).fillColor('#CCC').font('Helvetica')
    .text('Le guide complet pour transformer', 60, 396, { width: W - 120, align: 'center' })
    .text('votre peau en 30 jours', 60, 410, { width: W - 120, align: 'center' });
  var badgeY = 445;
  ['Acc\u00e8s \u00e0 vie', 'Quiz exclusif', '5 Masques DIY'].forEach(function(b, i) {
    var bx = 141 + i * 115;
    doc.roundedRect(bx, badgeY, 100, 24, 12).strokeColor(GOLD).lineWidth(0.6).stroke();
    doc.fontSize(8).fillColor(GOLD).font('Helvetica').text(b, bx, badgeY + 7, { width: 100, align: 'center' });
  });
  doc.fontSize(9).fillColor(GOLD).text('Par les experts LUMEA  \u2022  \u00c9dition 2025  \u2022  Canada', 60, 490, { width: W - 120, align: 'center' });
  doc.fontSize(8).fillColor('#888').text('lumea-boutique.onrender.com', 60, 520, { width: W - 120, align: 'center', link: 'https://lumea-boutique.onrender.com', underline: true });

  // ===== PAGE 2 : TABLE DES MATIERES =====
  np(CREAM); banner('\u2630', 'Table des Mati\u00e8res', 'Votre parcours vers une peau parfaite'); footer();
  doc.y = 155;
  [['01','Introduction','Votre peau m\u00e9rite le meilleur'],['02','Quiz : Type de Peau','Identifiez votre type en 5 questions'],
   ['03','Les 5 Piliers','Les fondamentaux essentiels'],['04','Routine du Matin','5 \u00e9tapes en 5 minutes'],
   ['05','Routine du Soir','R\u00e9paration et actifs puissants'],['06','Ingr\u00e9dients Miracles','8 actifs prouv\u00e9s scientifiquement'],
   ['07','Masques Maison','5 recettes naturelles'],['08','Alimentation Beaut\u00e9','Nourrir sa peau de l\u2019int\u00e9rieur'],
   ['09','Erreurs Fatales','11 erreurs \u00e0 \u00e9viter'],['10','Calendrier 30 Jours','Plan d\u2019action quotidien'],
   ['11','FAQ','R\u00e9ponses aux questions courantes'],
   ['B1','Produits recommand\u00e9s','Par budget (mini \u00e0 premium)'],
   ['B2','Compatibilit\u00e9 actifs','Quoi m\u00e9langer, quoi \u00e9viter'],
   ['B3','Solutions par probl\u00e8me','Acn\u00e9, taches, rides, rougeurs...'],
   ['B4','Routine saisonni\u00e8re','Adapter selon le climat canadien'],
   ['B5','Liste de courses','Pr\u00eate \u00e0 imprimer']
  ].forEach(function(item) {
    var y = doc.y;
    doc.roundedRect(60, y, W - 120, 30, 4).fill(WHITE);
    doc.circle(80, y + 15, 10).fill(item[0].startsWith('B') ? DGREEN : GOLD);
    doc.fontSize(7.5).fillColor(WHITE).font('Helvetica-Bold').text(item[0], 72, y + 11, { width: 16, align: 'center' });
    doc.fontSize(10).fillColor(DARK).font('Helvetica-Bold').text(item[1], 100, y + 5, { width: 280 });
    doc.fontSize(8).fillColor(GRAY).font('Helvetica').text(item[2], 100, y + 18, { width: 280 });
    doc.y = y + 34;
  });

  // ===== PAGE 3 : INTRODUCTION =====
  np(CREAM); banner('\u270E', 'Introduction', 'Votre peau m\u00e9rite le meilleur'); footer();
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
   'Un calendrier jour par jour pour les 30 prochains jours','Les erreurs que 90% des femmes font (et comment les corriger)',
   'Des recommandations produits concr\u00e8tes par budget','Un guide de compatibilit\u00e9 des actifs pour \u00e9viter les erreurs'].forEach(function(p) { bullet(p); });

  // ===== PAGE 4 : QUIZ =====
  np(CREAM); banner('\u2753', 'Quiz Exclusif', 'Quel est votre type de peau ?'); footer();
  doc.y = 148;
  doc.fontSize(10).fillColor(GRAY).font('Helvetica')
    .text('R\u00e9pondez \u00e0 ces 5 questions pour d\u00e9couvrir votre type de peau et adapter votre routine.', 60, doc.y, { width: W - 120, lineGap: 3 });
  doc.moveDown(0.6);

  [{q:'Le matin au r\u00e9veil, votre peau est :',o:['A) Confortable, ni grasse ni s\u00e8che','B) Tendue, avec des tiraillements','C) Brillante, surtout sur le front et le nez','D) Brillante zone T, s\u00e8che sur les joues','E) Rouge, avec des sensations d\u2019inconfort']},
   {q:'En milieu de journ\u00e9e, votre peau :',o:['A) Reste la m\u00eame qu\u2019au matin','B) Semble encore plus s\u00e8che','C) Brille partout','D) Brille sur le nez et le front seulement','E) Pr\u00e9sente des rougeurs ou picotements']},
   {q:'Quand vous appliquez un nouveau produit :',o:['A) Aucune r\u00e9action particuli\u00e8re','B) Votre peau \u00ab avale \u00bb tout rapidement','C) Votre peau devient plus grasse','D) Cela d\u00e9pend de la zone du visage','E) Vous avez souvent des r\u00e9actions']},
   {q:'Vos pores sont :',o:['A) Fins et peu visibles','B) Tr\u00e8s fins, presque invisibles','C) Dilat\u00e9s et visibles','D) Dilat\u00e9s sur le nez, fins sur les joues','E) Fins mais votre peau est r\u00e9active']},
   {q:'En hiver, votre peau :',o:['A) Va bien, pas de changement majeur','B) Desquame et tiraille beaucoup','C) Reste grasse','D) Les joues deviennent tr\u00e8s s\u00e8ches','E) Devient tr\u00e8s sensible au froid']}
  ].forEach(function(item, i) {
    if (doc.y > H - 160) { np(CREAM); banner('\u2753', 'Quiz (suite)', ''); footer(); doc.y = 148; }
    var y = doc.y;
    doc.circle(77, y + 7, 10).fill(GOLD);
    doc.fontSize(9).fillColor(WHITE).font('Helvetica-Bold').text((i+1).toString(), 72, y + 3, { width: 10, align: 'center' });
    doc.fontSize(10.5).fillColor(DARK).font('Helvetica-Bold').text(item.q, 96, y, { width: W - 170 });
    doc.moveDown(0.2);
    item.o.forEach(function(o) {
      var oy = doc.y;
      doc.roundedRect(96, oy, 8, 8, 2).strokeColor(GOLD).lineWidth(0.5).stroke();
      doc.fontSize(9).fillColor(GRAY).font('Helvetica').text(o, 110, oy, { width: W - 185 });
      doc.moveDown(0.1);
    });
    doc.moveDown(0.35);
  });
  doc.moveDown(0.2);
  var ry = doc.y;
  doc.roundedRect(60, ry, W - 120, 105, 6).fill(LGOLD);
  doc.roundedRect(60, ry, 3.5, 105, 2).fill(GOLD);
  doc.fontSize(11).fillColor(DARK).font('Helvetica-Bold').text('R\u00e9sultats :', 75, ry + 8);
  doc.fontSize(9).fillColor(GRAY).font('Helvetica');
  ['Majorit\u00e9 de A = Peau Normale \u2014 Routine d\u2019entretien et pr\u00e9vention',
   'Majorit\u00e9 de B = Peau S\u00e8che \u2014 Textures riches + acide hyaluronique',
   'Majorit\u00e9 de C = Peau Grasse \u2014 Textures l\u00e9g\u00e8res + niacinamide + BHA',
   'Majorit\u00e9 de D = Peau Mixte \u2014 Adapter les soins par zone du visage',
   'Majorit\u00e9 de E = Peau Sensible \u2014 Formules douces, sans parfum'
  ].forEach(function(r) { doc.text(r, 75, doc.y + 1, { width: W - 155 }); });

  // ===== PAGE 5 : 5 PILIERS =====
  np(CREAM); banner('\u2B50', 'Chapitre 1', 'Les 5 piliers d\u2019une peau parfaite'); footer();
  doc.y = 148;
  [{n:'01',t:'NETTOYAGE',d:'Un nettoyage doux matin et soir. Massez en mouvements circulaires pendant 60 secondes. Jamais d\u2019eau chaude \u2014 ti\u00e8de uniquement.'},
   {n:'02',t:'HYDRATATION',d:'M\u00eame les peaux grasses ont besoin d\u2019hydratation ! Renforcez la barri\u00e8re cutan\u00e9e. Appliquez toujours sur peau humide.'},
   {n:'03',t:'PROTECTION SOLAIRE',d:'SPF 30+ chaque matin, m\u00eame en hiver. Les UV causent 80% du vieillissement cutan\u00e9. Le produit anti-\u00e2ge #1.'},
   {n:'04',t:'NUTRITION',d:'Antioxydants, om\u00e9ga-3, et 2L d\u2019eau par jour. Votre peau refl\u00e8te ce que vous mangez.'},
   {n:'05',t:'SOMMEIL',d:'7-8 heures. Taie d\u2019oreiller en soie pour r\u00e9duire frictions et rides. La peau se r\u00e9g\u00e9n\u00e8re la nuit.'}
  ].forEach(function(p) {
    var y = doc.y, ch = 65;
    doc.roundedRect(60, y, W - 120, ch, 7).fill(WHITE);
    doc.roundedRect(60, y, W - 120, ch, 7).strokeColor('#E8E0D4').lineWidth(0.5).stroke();
    doc.fontSize(24).fillColor(GOLD).font('Helvetica-Bold').text(p.n, 72, y + 7);
    doc.fontSize(11).fillColor(DARK).font('Helvetica-Bold').text(p.t, 115, y + 9, { characterSpacing: 1 });
    doc.fontSize(9.5).fillColor(GRAY).font('Helvetica').text(p.d, 115, y + 26, { width: W - 200, lineGap: 3 });
    doc.y = y + ch + 5;
  });
  tip('La constance bat le produit cher ! Une routine simple chaque jour > routine complexe 2x/semaine.', '\u2605', LGOLD);

  // ===== PAGE 6 : ROUTINE MATIN =====
  np(CREAM); banner('\u2600', 'Chapitre 2', 'Routine du matin \u2014 5 \u00e9tapes'); footer();
  doc.y = 145;
  doc.fontSize(10).fillColor(GRAY).font('Helvetica')
    .text('Votre routine du matin prot\u00e8ge votre peau. Simple, rapide, efficace.', 60, doc.y, { width: W - 120, lineGap: 3 });
  doc.moveDown(0.5);
  [['Nettoyage doux (1 min)','Nettoyant sans sulfate. Massez en cercles, rincez \u00e0 l\u2019eau ti\u00e8de.'],
   ['Tonique hydratant (30 sec)','Sans alcool, appliquez avec les mains. Tapotez d\u00e9licatement.'],
   ['S\u00e9rum Vitamine C (1 min)','Votre meilleur alli\u00e9 \u00e9clat + anti-\u00e2ge. 3-4 gouttes sur peau humide.'],
   ['Cr\u00e8me hydratante (1 min)','Texture l\u00e9g\u00e8re (grasse) ou riche (s\u00e8che). Mouvements ascendants.'],
   ['SPF 30+ obligatoire (1 min)','LA \u00e9tape #1 ! 2 doigts de produit, 15 min avant exposition.']
  ].forEach(function(s,i) { step(i+1, s[0], s[1]); });
  sectionBreak();
  tip('Ordre : toujours du plus l\u00e9ger au plus \u00e9pais. S\u00e9rum avant cr\u00e8me !', '\u2605', BLUE);

  // ===== PAGE 7 : ROUTINE SOIR =====
  np(CREAM); banner('\u263E', 'Chapitre 3', 'Routine du soir \u2014 R\u00e9paration nocturne'); footer();
  doc.y = 145;
  doc.fontSize(10).fillColor(GRAY).font('Helvetica')
    .text('La nuit, votre peau se r\u00e9pare. Utilisez vos actifs les plus puissants.', 60, doc.y, { width: W - 120, lineGap: 3 });
  doc.moveDown(0.5);
  [['Double nettoyage (2 min)','Huile/baume puis nettoyant. Dissout maquillage + SPF.'],
   ['Exfoliation 2x/semaine (2 min)','AHA pour peaux s\u00e8ches. BHA pour peaux grasses. Max 2x/semaine.'],
   ['S\u00e9rum de nuit (1 min)','R\u00e9tinol = anti-\u00e2ge #1. Commencez \u00e0 0.3%, augmentez progressivement.'],
   ['Contour des yeux (30 sec)','Peau 5x plus fine. Caf\u00e9ine ou r\u00e9tinol. Tapotez avec l\u2019annulaire.'],
   ['Cr\u00e8me de nuit ou huile (1 min)','Plus riche que le jour. Jojoba ou rose musqu\u00e9e. R\u00e9g\u00e9n\u00e9ration 22h-2h.']
  ].forEach(function(s,i) { step(i+1, s[0], s[1]); });
  sectionBreak();
  tip('Ne combinez JAMAIS r\u00e9tinol + AHA/BHA le m\u00eame soir. Alternez un soir sur deux.', '\u26A0', PINK);

  // ===== PAGE 8-9 : INGREDIENTS =====
  np(CREAM); banner('\u2697', 'Chapitre 4', 'Les 8 ingr\u00e9dients miracles'); footer();
  doc.y = 145;
  doc.fontSize(10).fillColor(GRAY).font('Helvetica')
    .text('Actifs prouv\u00e9s scientifiquement. Apprenez \u00e0 les reconna\u00eetre sur les \u00e9tiquettes.', 60, doc.y, { width: W - 120, lineGap: 3 });
  doc.moveDown(0.5);

  function ingCard(name, when, desc, bg) {
    var y = doc.y, th = doc.heightOfString(desc, { width: W - 180, fontSize: 9.5 }), ch = th + 38;
    doc.roundedRect(60, y, W - 120, ch, 6).fill(bg);
    doc.fontSize(11).fillColor(DARK).font('Helvetica-Bold').text(name, 75, y + 9);
    var bw = doc.widthOfString(when, { fontSize: 8 }) + 14;
    doc.roundedRect(W - 70 - bw, y + 7, bw, 17, 8).fill(GOLD);
    doc.fontSize(8).fillColor(WHITE).font('Helvetica-Bold').text(when, W - 70 - bw + 7, y + 11, { width: bw - 14 });
    doc.fontSize(9.5).fillColor(GRAY).font('Helvetica').text(desc, 75, y + 27, { width: W - 180, lineGap: 2 });
    doc.y = y + ch + 5;
  }
  ingCard('Vitamine C', 'Matin', '\u00c9clat, anti-taches, antioxydant puissant. Concentration 10-20%. Forme L-ascorbique = la plus efficace. Protege contre les radicaux libres.', GREEN);
  ingCard('R\u00e9tinol', 'Soir', 'Anti-\u00e2ge #1 au monde. Stimule le renouvellement cellulaire et la production de collag\u00e8ne. Commencer 2x/semaine.', PINK);
  ingCard('Acide hyaluronique', 'Matin+Soir', 'Retient 1000x son poids en eau. Appliquer sur peau humide obligatoirement. Hydratation imm\u00e9diate et longue dur\u00e9e.', BLUE);
  ingCard('Niacinamide (B3)', 'Matin+Soir', 'Resserre les pores, contr\u00f4le le s\u00e9bum, unifie le teint. 5-10%. Compatible avec tous les actifs. L\u2019ingr\u00e9dient polyvalent.', LGOLD);

  np(CREAM); banner('\u2697', 'Chapitre 4 (suite)', 'Ingr\u00e9dients miracles'); footer();
  doc.y = 148;
  ingCard('AHA (Acide glycolique)', '2x/sem soir', 'Exfoliant chimique pour peaux s\u00e8ches/ternes. R\u00e9v\u00e8le un teint lumineux. SPF obligatoire le lendemain. 5-10%.', GREEN);
  ingCard('BHA (Acide salicylique)', '2x/sem soir', 'P\u00e9n\u00e8tre dans les pores pour les nettoyer en profondeur. Id\u00e9al peaux grasses/acn\u00e9iques. 1-2%.', BLUE);
  ingCard('Peptides', 'Matin+Soir', 'Stimulent la production de collag\u00e8ne naturel. Compl\u00e9ment id\u00e9al du r\u00e9tinol. Peptides de cuivre ou Matrixyl 3000.', LGOLD);
  ingCard('SPF (Filtres solaires)', 'Matin', 'SPF 30 minimum, 50 id\u00e9al. R\u00e9appliquer toutes les 2h en ext\u00e9rieur. Le geste anti-\u00e2ge le plus sous-estim\u00e9.', PINK);
  sectionBreak();
  tip('Un s\u00e9rum \u00e0 20 dollars peut \u00eatre aussi efficace qu\u2019un \u00e0 100 dollars. Lisez les \u00e9tiquettes INCI !', '\u2605', LGOLD);

  // ===== PAGE 10-11 : MASQUES =====
  np(CREAM); banner('\u2618', 'Chapitre 5', '5 recettes de masques maison'); footer();
  doc.y = 145;
  doc.fontSize(10).fillColor(GRAY).font('Helvetica')
    .text('Des masques efficaces avec des ingr\u00e9dients de votre cuisine. 1 \u00e0 2 fois par semaine.', 60, doc.y, { width: W - 120, lineGap: 3 });
  doc.moveDown(0.5);

  function mask(n, name, skin, ing, steps, bg) {
    if (doc.y > H - 140) { np(CREAM); banner('\u2618', 'Masques (suite)', 'Recettes naturelles'); footer(); doc.y = 148; }
    var y = doc.y;
    var ih = doc.heightOfString(ing, { width: W - 195, fontSize: 9.5 });
    var sh = doc.heightOfString(steps, { width: W - 195, fontSize: 9.5 });
    var ch = ih + sh + 72;
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
  mask(1, 'Masque \u00c9clat au Miel & Curcuma', 'Tous types', '2 c. \u00e0 soupe miel brut + 1/2 c. \u00e0 th\u00e9 curcuma + 1 c. \u00e0 soupe yogourt nature', 'M\u00e9langez. Visage propre, 15-20 min. Rincez ti\u00e8de. Le curcuma illumine, le miel hydrate.', LGOLD);
  mask(2, 'Masque Purifiant au Charbon', 'Grasses/mixtes', '1 capsule charbon actif + 1 c. \u00e0 soupe argile verte + eau de rose', 'P\u00e2te fine, 10 min max. Ne laissez JAMAIS s\u00e9cher compl\u00e8tement. Rincez.', BLUE);
  mask(3, 'Masque Hydratant Avocat', 'S\u00e8ches/d\u00e9shydrat\u00e9es', '1/2 avocat + 1 c. \u00e0 soupe miel + quelques gouttes huile jojoba', '\u00c9crasez, m\u00e9langez. Couche \u00e9paisse, 20 min. Peau repulp\u00e9e et nourrie.', GREEN);
  mask(4, 'Masque Anti-\u00c2ge Blanc d\u2019oeuf', 'Matures', '1 blanc d\u2019oeuf + 1 c. \u00e0 soupe jus citron + 1 c. \u00e0 th\u00e9 miel', 'Battez le blanc. Ajoutez citron + miel. 2 couches, 15 min. Effet tenseur !', PINK);
  mask(5, 'Masque Apaisant Aloe Vera', 'Sensibles/irrit\u00e9es', '2 c. \u00e0 soupe aloe vera pur + 1 c. \u00e0 soupe eau concombre + 2 gouttes huile camomille', 'M\u00e9langez, frigo 10 min. Couche \u00e9paisse, 20 min. Apr\u00e8s irritation ou soleil.', '#F0FFF8');

  // ===== PAGE 12 : ALIMENTATION =====
  np(CREAM); banner('\u2764', 'Chapitre 6', 'Alimentation & beaut\u00e9 de la peau'); footer();
  doc.y = 145;
  doc.fontSize(10).fillColor(GRAY).font('Helvetica')
    .text('Ce que vous mangez impacte directement votre peau. Aliments \u00e0 privil\u00e9gier et \u00e0 limiter.', 60, doc.y, { width: W - 120, lineGap: 3 });
  doc.moveDown(0.6);
  doc.roundedRect(60, doc.y, W - 120, 19, 4).fill(DGREEN);
  doc.fontSize(10).fillColor(WHITE).font('Helvetica-Bold').text('\u2713  \u00c0 PRIVIL\u00c9GIER', 72, doc.y + 4); doc.y += 24;
  ['Saumon, sardines (om\u00e9ga-3 anti-inflammatoires)','Baies : myrtilles, framboises (antioxydants puissants)',
   'Avocat (graisses saines pour la souplesse)','Patates douces, carottes (b\u00eata-carot\u00e8ne = vitamine A)',
   'Noix, amandes, graines de lin (vitamine E + zinc)','Th\u00e9 vert (polyph\u00e9nols anti-\u00e2ge)',
   '\u00c9pinards, kale (vitamines A, C, K et fer)','Eau : 2L/jour minimum (hydratation cellulaire)'].forEach(function(f) { bullet(f); });
  doc.moveDown(0.5);
  doc.roundedRect(60, doc.y, W - 120, 19, 4).fill(RED);
  doc.fontSize(10).fillColor(WHITE).font('Helvetica-Bold').text('\u2717  \u00c0 LIMITER', 72, doc.y + 4); doc.y += 24;
  ['Sucre raffin\u00e9 \u2014 acc\u00e9l\u00e8re le vieillissement (glycation)','Produits laitiers \u2014 peuvent aggraver l\u2019acn\u00e9',
   'Alcool \u2014 d\u00e9shydrate la peau, dilate les vaisseaux','Aliments ultra-transform\u00e9s \u2014 inflammatoires',
   'Exc\u00e8s de sel \u2014 r\u00e9tention d\u2019eau, poches sous les yeux'].forEach(function(f) { rbullet(f); });
  doc.moveDown(0.5);
  tip('Eau ti\u00e8de + citron chaque matin \u00e0 jeun. R\u00e9sultats visibles d\u00e8s la premi\u00e8re semaine !', '\u2605', LGOLD);

  // ===== PAGE 13 : ERREURS =====
  np(CREAM); banner('\u26A0', 'Chapitre 7', '11 erreurs fatales \u00e0 \u00e9viter'); footer();
  doc.y = 148;
  [['Dormir avec son maquillage','Obstrue les pores, cause acn\u00e9 et vieillissement pr\u00e9matur\u00e9.'],
   ['Utiliser de l\u2019eau chaude','D\u00e9truit le film hydrolipidique. Toujours ti\u00e8de ou froide.'],
   ['Changer de routine chaque semaine','Un produit a besoin de 4-6 semaines pour montrer ses effets.'],
   ['Oublier le cou et le d\u00e9collet\u00e9','Ces zones vieillissent aussi vite que le visage.'],
   ['Exfolier tous les jours','D\u00e9truit la barri\u00e8re cutan\u00e9e. Maximum 2 fois par semaine.'],
   ['Appliquer le r\u00e9tinol le matin','Photosensibilisant. Uniquement le soir.'],
   ['M\u00e9langer r\u00e9tinol + AHA/BHA','Jamais le m\u00eame soir. Alternez un soir sur deux.'],
   ['Oublier le SPF','80% du vieillissement visible vient des UV. Non n\u00e9gociable.'],
   ['Toucher son visage','Bact\u00e9ries = boutons. Nettoyez aussi votre t\u00e9l\u00e9phone.'],
   ['Utiliser des produits p\u00e9rim\u00e9s','V\u00e9rifiez la PAO (P\u00e9riode Apr\u00e8s Ouverture).'],
   ['Manquer de r\u00e9gularit\u00e9','La constance > le produit le plus cher.']
  ].forEach(function(item, i) {
    if (doc.y > H - 65) { np(CREAM); banner('\u26A0', 'Erreurs (suite)', ''); footer(); doc.y = 148; }
    var y = doc.y, ch = 38;
    doc.roundedRect(60, y, W - 120, ch, 5).fill(i % 2 === 0 ? WHITE : '#FFF8F8');
    doc.circle(81, y + ch / 2, 10).fill(RED);
    doc.fontSize(8.5).fillColor(WHITE).font('Helvetica-Bold').text((i+1).toString(), 74, y + ch/2 - 4, { width: 14, align: 'center' });
    doc.fontSize(10).fillColor(DARK).font('Helvetica-Bold').text(item[0], 100, y + 5, { width: W - 190 });
    doc.fontSize(9).fillColor(GRAY).font('Helvetica').text(item[1], 100, y + 19, { width: W - 190 });
    doc.y = y + ch + 4;
  });

  // ===== PAGE 14-15 : CALENDRIER =====
  np(CREAM); banner('\u2611', 'Chapitre 8', 'Plan d\u2019action 30 jours'); footer();
  doc.y = 148;
  doc.fontSize(10).fillColor(GRAY).font('Helvetica')
    .text('Cochez chaque \u00e9tape accomplie. La r\u00e9gularit\u00e9 est la cl\u00e9 !', 60, doc.y, { width: W - 120, lineGap: 3 });
  doc.moveDown(0.5);
  weekH('SEMAINE 1 : Pr\u00e9paration');
  ['Jour 1-3 : Nettoyage matin + soir + hydratant uniquement. Observez votre peau.',
   'Jour 4 : Ajoutez le s\u00e9rum vitamine C le matin.',
   'Jour 5 : Ajoutez la cr\u00e8me solaire SPF 30+ le matin.',
   'Jour 6 : Premi\u00e8re exfoliation douce le soir (AHA ou BHA).',
   'Jour 7 : Jour de repos \u2014 masque hydratant maison.'].forEach(function(d) { check(d); });
  doc.moveDown(0.3);
  weekH('SEMAINE 2 : Construction');
  ['Jour 8-10 : Routine de base + contour des yeux le soir.',
   'Jour 11 : Introduisez le r\u00e9tinol (faible dose) 1x cette semaine.',
   'Jour 12 : Deuxi\u00e8me exfoliation de la semaine.',
   'Jour 13 : Masque purifiant au charbon.',
   'Jour 14 : \u00c9valuez. Moins de brillance ? Plus d\u2019\u00e9clat ? Ajustez.'].forEach(function(d) { check(d); });

  np(CREAM); banner('\u2611', 'Calendrier (suite)', 'Semaines 3 et 4'); footer();
  doc.y = 148;
  weekH('SEMAINE 3 : Intensification');
  ['Jour 15-17 : R\u00e9tinol 2x par semaine. Surveillez la tol\u00e9rance.',
   'Jour 18 : Essayez le double nettoyage le soir.',
   'Jour 19 : Masque \u00e9clat au miel et curcuma.',
   'Jour 20 : Augmentez la concentration vitamine C si tol\u00e9r\u00e9e.',
   'Jour 21 : Photo de progression ! Comparez avec le jour 1.'].forEach(function(d) { check(d); });
  doc.moveDown(0.3);
  weekH('SEMAINE 4 : Transformation');
  ['Jour 22-25 : Routine compl\u00e8te install\u00e9e. Maintenez la r\u00e9gularit\u00e9.',
   'Jour 26 : Masque anti-\u00e2ge ou hydratant selon votre besoin.',
   'Jour 27 : \u00c9valuez vos r\u00e9sultats. Quels produits pr\u00e9f\u00e9rez-vous ?',
   'Jour 28-29 : Affinez votre routine d\u00e9finitive.',
   'Jour 30 : Photo finale ! C\u00e9l\u00e9brez votre transformation !'].forEach(function(d) { check(d); });
  doc.moveDown(0.6);
  tip('Photo Jour 1 vs Jour 30, m\u00eame \u00e9clairage. Vous serez impressionn\u00e9e !', '\u2605', LGOLD);

  // ===== PAGE 16 : FAQ =====
  np(CREAM); banner('\u2754', 'FAQ', 'Questions fr\u00e9quentes'); footer();
  doc.y = 148;
  [['Combien de temps avant de voir des r\u00e9sultats ?','Premiers changements en 7-14 jours. R\u00e9sultats significatifs en 4-8 semaines avec routine constante.'],
   ['Puis-je utiliser ces conseils enceinte ?','\u00c9vitez le r\u00e9tinol et les AHA/BHA forts. Consultez votre dermatologue. Le reste du guide est compatible.'],
   ['Dois-je acheter des produits chers ?','Non ! L\u2019important ce sont les ingr\u00e9dients, pas la marque. Voir notre page de recommandations par budget.'],
   ['Comment savoir si un produit ne convient pas ?','Test sur une petite zone 24h avant. Rougeur/irritation = arr\u00eatez. L\u00e9ger picotement avec AHA = normal.'],
   ['Le masque au citron est-il dangereux ?','Le citron pur est trop acide (pH 2). Dans nos recettes il est dilu\u00e9. Ne jamais appliquer pur sur la peau.'],
   ['Quelle est la diff\u00e9rence entre AHA et BHA ?','AHA (glycolique) = surface, pour peaux s\u00e8ches/ternes. BHA (salicylique) = en profondeur dans les pores, pour peaux grasses/acn\u00e9.'],
   ['Peut-on utiliser le r\u00e9tinol \u00e0 20 ans ?','Oui, mais faible concentration (0.1-0.3%). Id\u00e9al pour la pr\u00e9vention. Augmentez avec l\u2019\u00e2ge.']
  ].forEach(function(item) {
    if (doc.y > H - 85) { np(CREAM); banner('\u2754', 'FAQ (suite)', ''); footer(); doc.y = 148; }
    var y = doc.y, ah = doc.heightOfString(item[1], { width: W - 155, fontSize: 9.5 }), ch = ah + 32;
    doc.roundedRect(60, y, W - 120, ch, 5).fill(WHITE);
    doc.fontSize(10).fillColor(DARK).font('Helvetica-Bold').text('Q : ' + item[0], 72, y + 7, { width: W - 155 });
    doc.fontSize(9.5).fillColor(GRAY).font('Helvetica').text('R : ' + item[1], 72, y + 22, { width: W - 155, lineGap: 2 });
    doc.y = y + ch + 5;
  });

  // ===== BONUS 1 : RECOMMANDATIONS PRODUITS =====
  np(CREAM); banner('\u{1F6D2}', 'Bonus 1', 'Recommandations produits par budget'); footer();
  doc.y = 148;
  doc.fontSize(10).fillColor(GRAY).font('Helvetica')
    .text('Pas besoin de d\u00e9penser une fortune. Voici nos recommandations test\u00e9es, disponibles au Canada.', 60, doc.y, { width: W - 120, lineGap: 3 });
  doc.moveDown(0.5);

  function prodLine(name, price, note) {
    if (doc.y > H - 60) { np(CREAM); banner('\u{1F6D2}', 'Produits (suite)', ''); footer(); doc.y = 148; }
    var y = doc.y;
    doc.roundedRect(68, y, W - 136, 30, 4).fill(WHITE);
    doc.fontSize(9.5).fillColor(DARK).font('Helvetica-Bold').text(name, 78, y + 4, { width: 260 });
    doc.fontSize(8.5).fillColor(GRAY).font('Helvetica').text(note, 78, y + 17, { width: 310 });
    doc.fontSize(9).fillColor(GOLD).font('Helvetica-Bold').text(price, W - 130, y + 9, { width: 55, align: 'right' });
    doc.y = y + 34;
  }

  doc.roundedRect(60, doc.y, W - 120, 20, 4).fill(DGREEN);
  doc.fontSize(10).fillColor(WHITE).font('Helvetica-Bold').text('BUDGET MINI (moins de 50 dollars/mois)', 72, doc.y + 4); doc.y += 24;
  prodLine('CeraVe Nettoyant Hydratant', '~16 CAD', 'Doux, sans sulfate. Pharmacie partout au Canada.');
  prodLine('The Ordinary Niacinamide 10%', '~8 CAD', 'Contr\u00f4le s\u00e9bum, r\u00e9duit pores. Imbattable.');
  prodLine('The Ordinary Acide Hyaluronique', '~9 CAD', 'Hydratation intense. Sur peau humide.');
  prodLine('Neutrogena Ultra Sheer SPF 60', '~15 CAD', 'Protection solaire l\u00e9g\u00e8re, non grasse.');

  doc.roundedRect(60, doc.y, W - 120, 20, 4).fill(GOLD);
  doc.fontSize(10).fillColor(WHITE).font('Helvetica-Bold').text('BUDGET MOYEN (50-120 dollars/mois)', 72, doc.y + 4); doc.y += 24;
  prodLine('La Roche-Posay Toleriane Nettoyant', '~25 CAD', 'Peaux sensibles. Formule minimaliste.');
  prodLine('Paula\'s Choice BHA 2% Exfoliant', '~38 CAD', 'Meilleur BHA du march\u00e9. R\u00e9sultats en 2 semaines.');
  prodLine('Vichy Liftactiv Vitamine C', '~42 CAD', 'Vitamine C stabilis\u00e9e. \u00c9clat garanti.');
  prodLine('CeraVe Cr\u00e8me Hydratante PM', '~22 CAD', 'Niacinamide + c\u00e9ramides. Texture l\u00e9g\u00e8re.');

  // ===== BONUS 2 : COMPATIBILITE =====
  np(CREAM); banner('\u2697', 'Bonus 2', 'Guide de compatibilit\u00e9 des actifs'); footer();
  doc.y = 148;
  doc.fontSize(10).fillColor(GRAY).font('Helvetica')
    .text('Certains actifs se boostent, d\u2019autres s\u2019annulent ou irritent. Votre r\u00e9f\u00e9rence rapide.', 60, doc.y, { width: W - 120, lineGap: 3 });
  doc.moveDown(0.5);

  doc.roundedRect(60, doc.y, W - 120, 20, 4).fill(DGREEN);
  doc.fontSize(10).fillColor(WHITE).font('Helvetica-Bold').text('COMBINAISONS GAGNANTES', 72, doc.y + 4); doc.y += 25;
  [['Vitamine C + SPF (matin)', 'La vitamine C booste l\u2019efficacit\u00e9 du SPF de 4x. Protection maximale contre les UV.'],
   ['Acide hyaluronique + Niacinamide', 'Hydratation + contr\u00f4le des pores. Parfait ensemble matin et soir.'],
   ['R\u00e9tinol + Peptides (soir)', 'Les peptides calment l\u2019irritation du r\u00e9tinol. Duo anti-\u00e2ge puissant.'],
   ['AHA + Niacinamide', 'Exfoliation + r\u00e9paration. La niacinamide att\u00e9nue l\u2019irritation des acides.'],
   ['Vitamine C + Vitamine E', 'Antioxydants synergiques : ensemble, efficacit\u00e9 multipli\u00e9e par 8.']
  ].forEach(function(item) {
    var y = doc.y;
    doc.roundedRect(68, y, W - 136, 30, 4).fill(GREEN);
    doc.fontSize(9.5).fillColor(DARK).font('Helvetica-Bold').text(item[0], 78, y + 3, { width: W - 175 });
    doc.fontSize(8.5).fillColor(GRAY).font('Helvetica').text(item[1], 78, y + 16, { width: W - 175 });
    doc.y = y + 34;
  });

  doc.moveDown(0.2);
  doc.roundedRect(60, doc.y, W - 120, 20, 4).fill(RED);
  doc.fontSize(10).fillColor(WHITE).font('Helvetica-Bold').text('COMBINAISONS \u00c0 \u00c9VITER', 72, doc.y + 4); doc.y += 25;
  [['R\u00e9tinol + AHA/BHA (m\u00eame soir)', 'Double irritation. Alternez : lundi r\u00e9tinol, mercredi AHA.'],
   ['R\u00e9tinol + Vitamine C (m\u00eame moment)', 'pH incompatibles. Vit C le matin, r\u00e9tinol le soir.'],
   ['AHA/BHA + Vitamine C (m\u00eame routine)', 'Trop acide. Vit C le matin, exfoliants le soir.'],
   ['Niacinamide + Vitamine C pure', 'Peut rougir. Attendez 15 min entre les deux.']
  ].forEach(function(item) {
    var y = doc.y;
    doc.roundedRect(68, y, W - 136, 30, 4).fill(PINK);
    doc.fontSize(9.5).fillColor(DARK).font('Helvetica-Bold').text(item[0], 78, y + 3, { width: W - 175 });
    doc.fontSize(8.5).fillColor(GRAY).font('Helvetica').text(item[1], 78, y + 16, { width: W - 175 });
    doc.y = y + 34;
  });

  // ===== BONUS 3 : SOLUTIONS PAR PROBLEME =====
  np(CREAM); banner('\u{1F3AF}', 'Bonus 3', 'Solutions par probl\u00e8me de peau'); footer();
  doc.y = 148;

  function concern(title, causes, solution, actifs) {
    if (doc.y > H - 110) { np(CREAM); banner('\u{1F3AF}', 'Solutions (suite)', ''); footer(); doc.y = 148; }
    var y = doc.y;
    doc.roundedRect(60, y, W - 120, 17, 3).fill(GOLD);
    doc.fontSize(9).fillColor(WHITE).font('Helvetica-Bold').text(title, 72, y + 3);
    doc.y = y + 21;
    doc.fontSize(8.5).fillColor(RED).font('Helvetica-Bold').text('Causes : ', 72, doc.y);
    doc.fontSize(8.5).fillColor(GRAY).font('Helvetica').text(causes, 112, doc.y, { width: W - 195 });
    doc.moveDown(0.15);
    doc.fontSize(8.5).fillColor(DGREEN).font('Helvetica-Bold').text('Solution : ', 72, doc.y);
    doc.fontSize(8.5).fillColor(GRAY).font('Helvetica').text(solution, 118, doc.y, { width: W - 200 });
    doc.moveDown(0.15);
    doc.fontSize(8.5).fillColor(GOLD).font('Helvetica-Bold').text('Actifs cl\u00e9s : ', 72, doc.y);
    doc.fontSize(8.5).fillColor(GRAY).font('Helvetica').text(actifs, 124, doc.y, { width: W - 205 });
    doc.moveDown(0.6);
  }

  concern('ACNE & BOUTONS', 'Exc\u00e8s de s\u00e9bum, bact\u00e9ries, pores obstru\u00e9s, hormones, stress.',
    'Nettoyage doux (pas agressif !), BHA 2% soir 2-3x/sem, hydratant l\u00e9ger non-com\u00e9dog\u00e8ne.',
    'Acide salicylique (BHA), Niacinamide 5-10%, Zinc, Arbre \u00e0 th\u00e9.');
  concern('TACHES BRUNES & HYPERPIGMENTATION', 'Soleil, cicatrices d\u2019acn\u00e9, hormones (m\u00e9lasma), vieillissement.',
    'SPF 50 CHAQUE JOUR, Vitamine C le matin, AHA le soir 2x/sem.',
    'Vitamine C 15-20%, Alpha-arbutine, Acide tranexamique, AHA, R\u00e9tinol.');
  concern('RIDES & PERTE DE FERMET\u00c9', 'Vieillissement naturel, UV, perte de collag\u00e8ne, d\u00e9shydratation.',
    'R\u00e9tinol progressif le soir, SPF le matin, hydratation intense, massage facial.',
    'R\u00e9tinol 0.3-1%, Peptides (Matrixyl), Vitamine C, Acide hyaluronique.');
  concern('ROUGEURS & SENSIBILIT\u00c9', 'Barri\u00e8re fragile, ros\u00e9e, irritants, temp\u00e9ratures extr\u00eames.',
    'Routine minimaliste (3 produits max). \u00c9viter alcool, parfums, exfoliants agressifs.',
    'Centella asiatica, Niacinamide 5%, Aloe vera, C\u00e9ramides, Avoine.');
  concern('PORES DILAT\u00c9S', 'G\u00e9n\u00e9tique, exc\u00e8s de s\u00e9bum, perte d\u2019\u00e9lasticit\u00e9, mauvais nettoyage.',
    'BHA r\u00e9gulier, nettoyage en profondeur, masque argile 1x/sem, r\u00e9tinol.',
    'BHA 2%, Niacinamide 10%, R\u00e9tinol, Argile verte.');
  concern('TEINT TERNE & FATIGUE', 'Cellules mortes, d\u00e9shydratation, manque de sommeil.',
    'Exfoliation AHA 2x/sem, Vitamine C le matin, masque \u00e9clat 1x/sem, 2L eau/jour.',
    'AHA (acide glycolique 8%), Vitamine C, Acide hyaluronique.');

  // ===== BONUS 4 : ROUTINE SAISONNIERE =====
  np(CREAM); banner('\u{1F343}', 'Bonus 4', 'Adapter sa routine aux saisons'); footer();
  doc.y = 148;
  doc.fontSize(10).fillColor(GRAY).font('Helvetica')
    .text('Au Canada, les \u00e9carts de temp\u00e9rature sont extr\u00eames. Ajustements essentiels.', 60, doc.y, { width: W - 120, lineGap: 3 });
  doc.moveDown(0.5);

  function seasonBlock(title, tips, bg) {
    doc.roundedRect(60, doc.y, W - 120, 20, 4).fill(bg);
    doc.fontSize(10).fillColor(WHITE).font('Helvetica-Bold').text(title, 72, doc.y + 4);
    doc.y += 25;
    tips.forEach(function(t) {
      var ty = doc.y;
      doc.circle(76, ty + 4, 2).fill(GOLD);
      doc.fontSize(9).fillColor(GRAY).font('Helvetica').text(t, 86, ty, { width: W - 170, lineGap: 2 });
      doc.moveDown(0.15);
    });
    doc.moveDown(0.4);
  }

  seasonBlock('HIVER (Novembre \u2013 Mars)', [
    'Nettoyant cr\u00e8me (pas de gel moussant qui ass\u00e8che).',
    'Doublez l\u2019hydratation : s\u00e9rum hyaluronique + cr\u00e8me riche aux c\u00e9ramides.',
    'Ajoutez une huile faciale le soir (jojoba, rose musqu\u00e9e).',
    'Humidificateur dans la chambre (le chauffage = 15% d\u2019humidit\u00e9 seulement).',
    'SPF obligatoire ! La neige r\u00e9fl\u00e9chit 80% des UV.',
    'R\u00e9duisez les exfoliants (1x/sem au lieu de 2x).'
  ], '#4A6FA5');
  seasonBlock('\u00c9T\u00c9 (Mai \u2013 Septembre)', [
    'Nettoyant gel l\u00e9ger, double nettoyage le soir (SPF + sueur).',
    'Cr\u00e8me l\u00e9g\u00e8re ou gel hydratant (pas de textures lourdes).',
    'SPF 50+ r\u00e9appliqu\u00e9 toutes les 2h. Chapeau + lunettes.',
    'Vitamine C chaque matin (antioxydant contre les UV).',
    'Masque aloe vera apr\u00e8s exposition solaire.',
    'Brume hydratante dans la journ\u00e9e (eau thermale).'
  ], '#D4845C');
  seasonBlock('PRINTEMPS & AUTOMNE', [
    'P\u00e9riode id\u00e9ale pour introduire de nouveaux actifs.',
    'Augmentez progressivement l\u2019exfoliation apr\u00e8s l\u2019hiver.',
    'Surveillez les allergies saisonni\u00e8res (pollen = peau r\u00e9active).',
    'Ajustez la texture de votre cr\u00e8me selon la m\u00e9t\u00e9o.'
  ], DGREEN);
  tip('Si votre peau tiraille : ajoutez de l\u2019hydratation. Si elle brille : all\u00e9gez la texture.', '\u2605', LGOLD);

  // ===== BONUS 5 : LISTE DE COURSES =====
  np(CREAM); banner('\u{1F4CB}', 'Bonus 5', 'Votre liste de courses skincare'); footer();
  doc.y = 148;
  doc.fontSize(10).fillColor(GRAY).font('Helvetica')
    .text('Imprimez cette page et emportez-la en pharmacie. Cochez vos achats.', 60, doc.y, { width: W - 120, lineGap: 3 });
  doc.moveDown(0.5);

  function shopCat(title, items, bg) {
    doc.roundedRect(60, doc.y, W - 120, 18, 3).fill(bg);
    doc.fontSize(9).fillColor(WHITE).font('Helvetica-Bold').text(title, 72, doc.y + 3);
    doc.y += 22;
    items.forEach(function(item) {
      var y = doc.y;
      doc.roundedRect(72, y + 1, 10, 10, 2).strokeColor(GOLD).lineWidth(0.7).stroke();
      doc.fontSize(9).fillColor(DARK).font('Helvetica').text(item, 90, y + 1, { width: W - 175 });
      doc.moveDown(0.25);
    });
    doc.moveDown(0.3);
  }
  shopCat('ESSENTIELS (commencez par ceux-ci)', [
    'Nettoyant doux sans sulfate (CeraVe, La Roche-Posay, Cetaphil)',
    'Cr\u00e8me hydratante avec c\u00e9ramides (CeraVe PM, Cetaphil)',
    'Protection solaire SPF 30-50 (Neutrogena, La Roche-Posay Anthelios)',
  ], GOLD);
  shopCat('ACTIFS PRINCIPAUX (semaine 1-2)', [
    'S\u00e9rum Vitamine C 10-20% (The Ordinary, Vichy, Timeless)',
    'S\u00e9rum Acide Hyaluronique (The Ordinary, Vichy Mineral 89)',
    'Tonique sans alcool (Thayers, Paula\'s Choice)',
  ], DGREEN);
  shopCat('ACTIFS AVANCES (semaine 2-3)', [
    'R\u00e9tinol 0.3-0.5% (The Ordinary, La Roche-Posay Retinol B3)',
    'Exfoliant BHA 2% (Paula\'s Choice, The Ordinary Salicylic)',
    'Exfoliant AHA (The Ordinary Glycolic 7%, Pixi Glow Tonic)',
    'Contour des yeux (CeraVe Eye Repair, The Ordinary Caffeine)',
  ], '#4A6FA5');
  shopCat('EXTRAS & MASQUES', [
    'Huile de jojoba ou rose musqu\u00e9e (soir)',
    'Miel brut, curcuma, argile verte (masques maison)',
    'Aloe vera gel pur (apr\u00e8s-soleil, masque apaisant)',
    'Eau thermale en brume (La Roche-Posay, Avene)',
  ], GOLD);
  tip('Budget minimum pour commencer : environ 40-50 CAD pour les 3 essentiels.', '\u2605', LGOLD);

  // ===== DERNIERE PAGE : MERCI =====
  np(DARK);
  doc.rect(45, 45, W - 90, 1.5).fill(GOLD);
  doc.rect(45, H - 46.5, W - 90, 1.5).fill(GOLD);
  doc.rect(45, 45, 1.5, H - 90).fill('rgba(201,169,110,0.3)');
  doc.rect(W - 46.5, 45, 1.5, H - 90).fill('rgba(201,169,110,0.3)');
  corners();
  doc.circle(W / 2, 200, 30).lineWidth(0.8).strokeColor(GOLD).stroke();
  doc.fontSize(6).fillColor(GOLD).font('Helvetica').text('L U M E A', W / 2 - 25, 197, { width: 50, align: 'center', characterSpacing: 1.5 });
  doc.fontSize(32).fillColor(WHITE).font('Helvetica-Bold').text('Merci !', 60, 280, { width: W - 120, align: 'center' });
  doc.fontSize(14).fillColor(GOLD).font('Helvetica').text('Votre peau vous remerciera.', 60, 325, { width: W - 120, align: 'center' });
  doc.fontSize(11).fillColor('#BBB').font('Helvetica')
    .text('Commencez d\u00e8s aujourd\u2019hui et prenez', 60, 355, { width: W - 120, align: 'center' })
    .text('votre photo du Jour 1 !', 60, 370, { width: W - 120, align: 'center' });
  doc.rect(W / 2 - 40, 400, 80, 1.5).fill(GOLD);
  doc.fontSize(10).fillColor(GOLD)
    .text('lumea-boutique.onrender.com', 60, 430, { width: W - 120, align: 'center', link: 'https://lumea-boutique.onrender.com', underline: true });
  doc.fontSize(8).fillColor('#555')
    .text('Ce guide est prot\u00e9g\u00e9 par le droit d\u2019auteur. Toute reproduction est interdite.', 60, 470, { width: W - 120, align: 'center' })
    .text('\u00A9 2025 LUMEA Canada. Tous droits r\u00e9serv\u00e9s.', 60, 485, { width: W - 120, align: 'center' });

  doc.end();
  return new Promise(function(r, j) { stream.on('finish', function() { console.log('Guide PDF generated:', outputPath); r(outputPath); }); stream.on('error', j); });
}

if (require.main === module) generateGuide().then(function() { console.log('Done!'); }).catch(console.error);
module.exports = { generateGuide };
