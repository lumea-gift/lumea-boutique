const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generateGuide() {
  const outputPath = path.join(__dirname, 'data', 'guide-lumea.pdf');
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
  
  if (fs.existsSync(outputPath)) {
    console.log('Guide PDF already exists.');
    return outputPath;
  }

  const doc = new PDFDocument({ size: 'LETTER', margin: 60 });
  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  const GOLD = '#C9A96E';
  const DARK = '#1A1A1A';
  const GRAY = '#555555';
  const LIGHT_BG = '#F5F0EB';

  // ====== COVER PAGE ======
  doc.rect(0, 0, doc.page.width, doc.page.height).fill(DARK);
  
  // Gold decorative line
  doc.rect(60, 80, doc.page.width - 120, 2).fill(GOLD);
  doc.rect(60, doc.page.height - 82, doc.page.width - 120, 2).fill(GOLD);
  
  // Corner accents
  doc.rect(50, 70, 30, 2).fill(GOLD);
  doc.rect(50, 70, 2, 30).fill(GOLD);
  doc.rect(doc.page.width - 80, 70, 30, 2).fill(GOLD);
  doc.rect(doc.page.width - 52, 70, 2, 30).fill(GOLD);
  
  doc.fontSize(14).fillColor(GOLD).font('Helvetica')
    .text('L U M E A', 0, 200, { align: 'center', characterSpacing: 8 });
  
  doc.moveDown(2);
  doc.fontSize(36).fillColor('#FFFFFF').font('Helvetica-Bold')
    .text('Routine Peau', { align: 'center' });
  doc.fontSize(36).fillColor(GOLD).font('Helvetica-BoldOblique')
    .text('Parfaite', { align: 'center' });
  doc.fontSize(36).fillColor('#FFFFFF').font('Helvetica-Bold')
    .text('30 Jours', { align: 'center' });
  
  doc.moveDown(2);
  doc.rect(doc.page.width / 2 - 30, doc.y, 60, 1).fill(GOLD);
  
  doc.moveDown(2);
  doc.fontSize(14).fillColor('#AAAAAA').font('Helvetica')
    .text('Le guide complet pour transformer', { align: 'center' });
  doc.text('votre peau en 30 jours', { align: 'center' });
  
  doc.moveDown(4);
  doc.fontSize(11).fillColor(GOLD).font('Helvetica')
    .text('Par les experts LUMEA', { align: 'center' });
  doc.fontSize(10).fillColor('#777777')
    .text('Edition 2025 | Canada', { align: 'center' });

  // ====== PAGE 2: TABLE DES MATIERES ======
  doc.addPage();
  drawPageHeader(doc, 'Table des matieres', GOLD, DARK);
  
  const toc = [
    ['1', 'Introduction : Votre peau merite le meilleur', '3'],
    ['2', 'Comprendre votre type de peau', '4'],
    ['3', 'Les 5 piliers d\'une peau parfaite', '5'],
    ['4', 'Routine du matin (etape par etape)', '7'],
    ['5', 'Routine du soir (etape par etape)', '9'],
    ['6', 'Semaine 1-2 : Phase de preparation', '11'],
    ['7', 'Semaine 3-4 : Phase de transformation', '13'],
    ['8', 'Les ingredients miracles a connaitre', '15'],
    ['9', '5 recettes masques maison', '17'],
    ['10', 'Alimentation et beaute de la peau', '19'],
    ['11', 'Erreurs fatales a eviter', '21'],
    ['12', 'Plan d\'action 30 jours (calendrier)', '23'],
    ['13', 'FAQ et conseils bonus', '25'],
  ];
  
  doc.moveDown(1);
  toc.forEach(([num, title, page]) => {
    doc.fontSize(12).fillColor(GOLD).font('Helvetica-Bold')
      .text(num + '.', 80, doc.y, { continued: true, width: 30 });
    doc.fillColor(DARK).font('Helvetica')
      .text('  ' + title, { continued: true });
    doc.fillColor(GRAY)
      .text('  .......... ' + page, { align: 'right' });
    doc.moveDown(0.3);
  });

  // ====== PAGE 3: INTRODUCTION ======
  doc.addPage();
  drawPageHeader(doc, 'Introduction', GOLD, DARK);
  drawSubtitle(doc, 'Votre peau merite le meilleur', DARK);
  
  drawParagraph(doc, `Felicitations pour votre decision d'investir dans votre peau ! Ce guide est le fruit de 5 annees de recherche en dermatologie et de collaboration avec des experts en soins de la peau au Canada.`, GRAY);
  
  drawParagraph(doc, `Dans les 30 prochains jours, vous allez decouvrir une methode eprouvee qui a deja aide plus de 15 000 femmes a transformer leur peau. Que vous ayez des problemes d'acne, de secheresse, de taches pigmentaires ou simplement envie d'un teint plus lumineux, ce guide est fait pour vous.`, GRAY);
  
  drawQuote(doc, '"La beaute de la peau commence par une routine adaptee et constante. Pas de produits miracles, mais une methode qui fonctionne."', GOLD);
  
  drawSubtitle(doc, 'Ce que vous allez apprendre', DARK);
  
  const intro_points = [
    'Comment identifier votre type de peau exactement',
    'La routine matin et soir adaptee a VOS besoins',
    'Les ingredients qui fonctionnent vraiment (et ceux a eviter)',
    'Des recettes de masques maison avec des ingredients de cuisine',
    'Un calendrier jour par jour pour les 30 prochains jours',
    'Les erreurs que 90% des femmes font (et comment les corriger)',
  ];
  drawBulletList(doc, intro_points, GOLD, GRAY);

  // ====== PAGE 4: TYPES DE PEAU ======
  doc.addPage();
  drawPageHeader(doc, 'Chapitre 1', GOLD, DARK);
  drawSubtitle(doc, 'Comprendre votre type de peau', DARK);
  
  drawParagraph(doc, `Avant de commencer toute routine, il est essentiel de connaitre votre type de peau. Un soin mal adapte peut aggraver vos problemes au lieu de les resoudre.`, GRAY);
  
  const skinTypes = [
    { title: 'Peau normale', desc: 'Teint uniforme, peu de brillance, pores fins. Vous avez de la chance ! Votre routine sera axee sur le maintien et la prevention.' },
    { title: 'Peau seche', desc: 'Tiraillements, desquamation, teint terne. Votre peau manque de lipides. Privilegiez les textures riches et les ingredients hydratants comme l\'acide hyaluronique.' },
    { title: 'Peau grasse', desc: 'Brillance excessive, pores dilates, tendance acneique. Votre peau produit trop de sebum. Utilisez des textures legeres et des actifs matifiants.' },
    { title: 'Peau mixte', desc: 'Zone T grasse (front, nez, menton) et joues seches. La cle est d\'adapter les soins par zone.' },
    { title: 'Peau sensible', desc: 'Rougeurs, irritations, reactions aux produits. Privilegiez les formules douces, sans parfum et hypoallergeniques.' },
  ];
  
  skinTypes.forEach(type => {
    doc.moveDown(0.5);
    doc.fontSize(13).fillColor(GOLD).font('Helvetica-Bold')
      .text(type.title, 80);
    doc.fontSize(11).fillColor(GRAY).font('Helvetica')
      .text(type.desc, 80, doc.y, { width: doc.page.width - 160 });
    doc.moveDown(0.3);
  });

  // ====== PAGE 5-6: 5 PILIERS ======
  doc.addPage();
  drawPageHeader(doc, 'Chapitre 2', GOLD, DARK);
  drawSubtitle(doc, 'Les 5 piliers d\'une peau parfaite', DARK);
  
  const pillars = [
    { num: '01', title: 'NETTOYAGE', text: 'Un nettoyage doux matin et soir est la base de tout. Utilisez un nettoyant adapte a votre type de peau. Ne frottez jamais - massez delicatement en mouvements circulaires pendant 60 secondes.' },
    { num: '02', title: 'HYDRATATION', text: 'Meme les peaux grasses ont besoin d\'hydratation ! L\'hydratation renforce la barriere cutanee et previent le vieillissement premature. Appliquez toujours sur peau humide pour maximiser l\'absorption.' },
    { num: '03', title: 'PROTECTION SOLAIRE', text: 'Le SPF est le produit anti-age numero 1. Appliquez un SPF 30 minimum chaque matin, meme en hiver, meme par temps nuageux. Les UV sont responsables de 80% du vieillissement cutane.' },
    { num: '04', title: 'NUTRITION', text: 'Votre peau reflete ce que vous mangez. Les antioxydants (vitamines A, C, E), les omega-3 et une hydratation suffisante (2L d\'eau/jour) sont essentiels pour un teint eclatant.' },
    { num: '05', title: 'SOMMEIL', text: 'La peau se regenere pendant la nuit. 7 a 8 heures de sommeil sont necessaires. Dormez sur une taie d\'oreiller en soie pour reduire les frictions et les rides.' },
  ];
  
  pillars.forEach(p => {
    doc.moveDown(0.8);
    doc.fontSize(28).fillColor(GOLD).font('Helvetica-Bold')
      .text(p.num, 60, doc.y, { continued: true, width: 50 });
    doc.fontSize(14).fillColor(DARK).font('Helvetica-Bold')
      .text('  ' + p.title);
    doc.fontSize(11).fillColor(GRAY).font('Helvetica')
      .text(p.text, 80, doc.y, { width: doc.page.width - 160 });
    
    if (doc.y > doc.page.height - 150) {
      doc.addPage();
      drawPageHeader(doc, 'Chapitre 2 (suite)', GOLD, DARK);
    }
  });

  // ====== PAGE 7-8: ROUTINE MATIN ======
  doc.addPage();
  drawPageHeader(doc, 'Chapitre 3', GOLD, DARK);
  drawSubtitle(doc, 'Routine du matin', DARK);
  drawParagraph(doc, `Votre routine du matin doit etre simple et efficace. L'objectif : proteger votre peau pour la journee. Duree totale : 5 minutes.`, GRAY);
  
  const morningSteps = [
    { step: 'Etape 1 : Nettoyage doux (1 min)', desc: 'Utilisez un nettoyant doux sans sulfate. Massez en mouvements circulaires, rincez a l\'eau tiede. Ne jamais utiliser d\'eau chaude qui agresse la peau.' },
    { step: 'Etape 2 : Tonique (30 sec)', desc: 'Appliquez un tonique hydratant sans alcool avec vos mains (pas de coton qui absorbe le produit). Tapotez delicatement.' },
    { step: 'Etape 3 : Serum Vitamine C (1 min)', desc: 'Le serum est votre meilleur allie anti-age et eclat. 3-4 gouttes suffisent. Appliquez sur peau encore humide pour maximiser la penetration.' },
    { step: 'Etape 4 : Creme hydratante (1 min)', desc: 'Choisissez une texture adaptee a votre type de peau. Legere pour les peaux grasses, riche pour les peaux seches. Appliquez en mouvements ascendants.' },
    { step: 'Etape 5 : Protection solaire SPF 30+ (1 min)', desc: 'LA etape la plus importante. Appliquez generosement (2 doigts de produit) 15 minutes avant l\'exposition. Reappliquez toutes les 2 heures si exposition prolongee.' },
  ];
  
  morningSteps.forEach(s => {
    doc.moveDown(0.5);
    doc.fontSize(12).fillColor(GOLD).font('Helvetica-Bold').text(s.step, 80);
    doc.fontSize(11).fillColor(GRAY).font('Helvetica')
      .text(s.desc, 80, doc.y, { width: doc.page.width - 160 });
    
    if (doc.y > doc.page.height - 120) {
      doc.addPage();
      drawPageHeader(doc, 'Routine du matin (suite)', GOLD, DARK);
    }
  });
  
  doc.moveDown(1);
  drawQuote(doc, 'Astuce PRO : Appliquez vos produits du plus leger au plus epais. Serum avant creme, toujours !', GOLD);

  // ====== PAGE 9-10: ROUTINE SOIR ======
  doc.addPage();
  drawPageHeader(doc, 'Chapitre 4', GOLD, DARK);
  drawSubtitle(doc, 'Routine du soir', DARK);
  drawParagraph(doc, `La routine du soir est le moment ou votre peau se repare. C'est ici que vous utilisez vos actifs les plus puissants. Duree totale : 7-10 minutes.`, GRAY);
  
  const eveningSteps = [
    { step: 'Etape 1 : Double nettoyage (2 min)', desc: 'Premier nettoyage avec une huile ou un baume (dissout le maquillage et la creme solaire). Deuxieme nettoyage avec votre nettoyant habituel. Cette technique garantit une peau parfaitement propre.' },
    { step: 'Etape 2 : Exfoliation (2x/semaine) (2 min)', desc: 'Utilisez un exfoliant chimique (AHA/BHA) plutot que physique (grains). Les AHA (acide glycolique) pour les peaux seches, les BHA (acide salicylique) pour les peaux grasses. Ne jamais exfolier plus de 2 fois par semaine.' },
    { step: 'Etape 3 : Serum de nuit (1 min)', desc: 'Le retinol est l\'ingredient anti-age le plus puissant. Commencez avec une faible concentration (0.3%) et augmentez progressivement. Alternez avec votre serum vitamine C.' },
    { step: 'Etape 4 : Contour des yeux (30 sec)', desc: 'La peau autour des yeux est 5 fois plus fine. Utilisez un soin specifique avec de la cafeine (anti-poches) ou du retinol (anti-rides). Appliquez en tapotant avec l\'annulaire.' },
    { step: 'Etape 5 : Creme de nuit ou huile (1 min)', desc: 'La nuit, utilisez une creme plus riche ou une huile visage (jojoba, rose musquee). Votre peau se regenere entre 22h et 2h du matin - profitez-en.' },
  ];
  
  eveningSteps.forEach(s => {
    doc.moveDown(0.5);
    doc.fontSize(12).fillColor(GOLD).font('Helvetica-Bold').text(s.step, 80);
    doc.fontSize(11).fillColor(GRAY).font('Helvetica')
      .text(s.desc, 80, doc.y, { width: doc.page.width - 160 });
    
    if (doc.y > doc.page.height - 120) {
      doc.addPage();
      drawPageHeader(doc, 'Routine du soir (suite)', GOLD, DARK);
    }
  });

  // ====== INGREDIENTS ======
  doc.addPage();
  drawPageHeader(doc, 'Chapitre 5', GOLD, DARK);
  drawSubtitle(doc, 'Les ingredients miracles', DARK);
  drawParagraph(doc, `Tous les ingredients ne se valent pas. Voici les actifs prouves scientifiquement et comment les utiliser :`, GRAY);
  
  const ingredients = [
    { name: 'Vitamine C (acide ascorbique)', use: 'Matin', benefit: 'Eclat, anti-taches, antioxydant. Concentration ideale : 10-20%. Cherchez la forme L-ascorbique pour la meilleure efficacite.' },
    { name: 'Retinol (vitamine A)', use: 'Soir', benefit: 'Anti-age numero 1. Stimule le renouvellement cellulaire, reduit rides et taches. Commencer doucement (2x/semaine) puis augmenter.' },
    { name: 'Acide hyaluronique', use: 'Matin + Soir', benefit: 'Hydratation profonde. Peut retenir 1000x son poids en eau. Appliquer sur peau humide obligatoirement.' },
    { name: 'Niacinamide (vitamine B3)', use: 'Matin + Soir', benefit: 'Resserre les pores, controle le sebum, uniformise le teint. Concentration ideale : 5-10%. Compatible avec presque tous les actifs.' },
    { name: 'AHA (acide glycolique)', use: 'Soir 2x/sem', benefit: 'Exfoliant chimique pour peaux seches/ternes. Elimine les cellules mortes, revele un teint lumineux. SPF obligatoire le lendemain.' },
    { name: 'BHA (acide salicylique)', use: 'Soir 2x/sem', benefit: 'Exfoliant pour peaux grasses/acneiques. Penetre dans les pores pour les nettoyer en profondeur. Concentration : 1-2%.' },
    { name: 'Peptides', use: 'Matin + Soir', benefit: 'Stimulent la production de collagene. Ideal en complement du retinol. Recherchez les peptides de cuivre ou Matrixyl.' },
    { name: 'SPF (filtres solaires)', use: 'Matin', benefit: 'Protection contre les UV, prevention du vieillissement. SPF 30 minimum, reappliquer toutes les 2 heures en cas d\'exposition.' },
  ];
  
  ingredients.forEach(ing => {
    if (doc.y > doc.page.height - 100) {
      doc.addPage();
      drawPageHeader(doc, 'Ingredients (suite)', GOLD, DARK);
    }
    doc.moveDown(0.5);
    doc.fontSize(12).fillColor(GOLD).font('Helvetica-Bold')
      .text(ing.name, 80, doc.y, { continued: true });
    doc.fontSize(10).fillColor('#888888').font('Helvetica')
      .text('  [' + ing.use + ']');
    doc.fontSize(11).fillColor(GRAY).font('Helvetica')
      .text(ing.benefit, 80, doc.y, { width: doc.page.width - 160 });
  });

  // ====== RECETTES MASQUES ======
  doc.addPage();
  drawPageHeader(doc, 'Chapitre 6', GOLD, DARK);
  drawSubtitle(doc, '5 recettes de masques maison', DARK);
  drawParagraph(doc, `Des masques efficaces avec des ingredients que vous avez deja dans votre cuisine. A faire 1 a 2 fois par semaine.`, GRAY);
  
  const masks = [
    {
      name: 'Masque Eclat au miel et curcuma',
      ingredients: '2 c. a soupe de miel brut, 1/2 c. a the de curcuma, 1 c. a soupe de yogourt nature',
      steps: 'Melangez tous les ingredients. Appliquez sur le visage propre. Laissez poser 15-20 minutes. Rincez a l\'eau tiede. Le curcuma illumine le teint et le miel hydrate en profondeur.',
      skin: 'Tous types de peau'
    },
    {
      name: 'Masque Purifiant au charbon',
      ingredients: '1 capsule de charbon actif, 1 c. a soupe d\'argile verte, eau de rose',
      steps: 'Melangez le charbon et l\'argile. Ajoutez l\'eau de rose pour former une pate. Appliquez en couche fine. Laissez 10 minutes (pas plus !). Rincez. Ne laissez JAMAIS secher completement.',
      skin: 'Peaux grasses/mixtes'
    },
    {
      name: 'Masque Hydratant a l\'avocat',
      ingredients: '1/2 avocat mur, 1 c. a soupe de miel, quelques gouttes d\'huile de jojoba',
      steps: 'Ecrasez l\'avocat, melangez avec le miel et l\'huile. Appliquez en couche epaisse. Laissez poser 20 minutes. Rincez. Votre peau sera repulpee et nourrie.',
      skin: 'Peaux seches/deshydratees'
    },
    {
      name: 'Masque Anti-Age au blanc d\'oeuf',
      ingredients: '1 blanc d\'oeuf, 1 c. a soupe de jus de citron, 1 c. a the de miel',
      steps: 'Battez le blanc d\'oeuf. Ajoutez le citron et le miel. Appliquez en 2 couches. Laissez 15 minutes. Rincez. Effet tenseur immediat.',
      skin: 'Peaux matures'
    },
    {
      name: 'Masque Apaisant a l\'aloe vera',
      ingredients: '2 c. a soupe de gel d\'aloe vera pur, 1 c. a soupe d\'eau de concombre, 2 gouttes d\'huile de camomille',
      steps: 'Melangez tous les ingredients. Gardez au frigo 10 minutes. Appliquez en couche epaisse. Laissez 20 minutes. Rincez. Ideal apres une irritation ou un coup de soleil.',
      skin: 'Peaux sensibles/irritees'
    },
  ];
  
  masks.forEach((mask, i) => {
    if (doc.y > doc.page.height - 180) {
      doc.addPage();
      drawPageHeader(doc, 'Masques maison (suite)', GOLD, DARK);
    }
    doc.moveDown(0.8);
    doc.fontSize(13).fillColor(GOLD).font('Helvetica-Bold')
      .text(`Recette ${i+1} : ${mask.name}`, 80);
    doc.fontSize(10).fillColor('#888888').font('Helvetica-Oblique')
      .text(`Pour : ${mask.skin}`, 80);
    doc.moveDown(0.3);
    doc.fontSize(11).fillColor(DARK).font('Helvetica-Bold')
      .text('Ingredients :', 80);
    doc.fontSize(11).fillColor(GRAY).font('Helvetica')
      .text(mask.ingredients, 95, doc.y, { width: doc.page.width - 175 });
    doc.moveDown(0.3);
    doc.fontSize(11).fillColor(DARK).font('Helvetica-Bold')
      .text('Preparation :', 80);
    doc.fontSize(11).fillColor(GRAY).font('Helvetica')
      .text(mask.steps, 95, doc.y, { width: doc.page.width - 175 });
  });

  // ====== ALIMENTATION ======
  doc.addPage();
  drawPageHeader(doc, 'Chapitre 7', GOLD, DARK);
  drawSubtitle(doc, 'Alimentation et beaute de la peau', DARK);
  drawParagraph(doc, `Ce que vous mangez a un impact direct sur votre peau. Voici les aliments a privilegier et ceux a limiter.`, GRAY);
  
  doc.moveDown(0.5);
  doc.fontSize(14).fillColor(GOLD).font('Helvetica-Bold')
    .text('Aliments a privilegier', 80);
  doc.moveDown(0.3);
  
  const goodFoods = [
    'Saumon, sardines, maquereau (omega-3 anti-inflammatoires)',
    'Baies (myrtilles, framboises) - antioxydants puissants',
    'Avocat - graisses saines pour la souplesse de la peau',
    'Patates douces, carottes - beta-carotene (precurseur vitamine A)',
    'Noix et graines (amandes, lin) - vitamine E et zinc',
    'The vert - polyphenols anti-age',
    'Epinards, kale - vitamines A, C, K et fer',
    'Eau (2L/jour minimum) - hydratation cellulaire',
  ];
  drawBulletList(doc, goodFoods, GOLD, GRAY);
  
  doc.moveDown(1);
  doc.fontSize(14).fillColor('#E53935').font('Helvetica-Bold')
    .text('Aliments a limiter', 80);
  doc.moveDown(0.3);
  
  const badFoods = [
    'Sucre raffine - accelere le vieillissement (glycation)',
    'Produits laitiers - peuvent aggraver l\'acne chez certaines personnes',
    'Alcool - deshydrate la peau et dilate les vaisseaux',
    'Aliments ultra-transformes - inflammatoires',
    'Exces de sel - retention d\'eau et poches sous les yeux',
  ];
  drawBulletList(doc, badFoods, '#E53935', GRAY);

  // ====== ERREURS A EVITER ======
  doc.addPage();
  drawPageHeader(doc, 'Chapitre 8', GOLD, DARK);
  drawSubtitle(doc, '11 erreurs fatales a eviter', DARK);
  
  const mistakes = [
    'Dormir avec son maquillage - Obstrue les pores, cause acne et vieillissement premature.',
    'Utiliser de l\'eau chaude - Detruit le film hydrolipidique. Toujours tiede ou froide.',
    'Changer de routine chaque semaine - Un produit a besoin de 4-6 semaines pour montrer ses effets.',
    'Oublier le cou et le decollete - Ces zones vieillissent aussi vite que le visage.',
    'Exfolier tous les jours - Detruit la barriere cutanee. Maximum 2x/semaine.',
    'Appliquer le retinol le matin - Il est photosensibilisant. Uniquement le soir.',
    'Melanger les actifs incompatibles - Ne jamais combiner retinol + AHA/BHA le meme soir.',
    'Ne pas utiliser de SPF - 80% du vieillissement est cause par les UV.',
    'Toucher son visage - Transfert de bacteries = boutons.',
    'Utiliser des produits perimes - Verifiez la PAO (Periode Apres Ouverture).',
    'Necesser d\'etre regulier - La constance est plus importante que le produit.',
  ];
  
  mistakes.forEach((mistake, i) => {
    if (doc.y > doc.page.height - 80) {
      doc.addPage();
      drawPageHeader(doc, 'Erreurs (suite)', GOLD, DARK);
    }
    doc.moveDown(0.4);
    doc.fontSize(11).fillColor('#E53935').font('Helvetica-Bold')
      .text(`${i+1}.`, 70, doc.y, { continued: true, width: 25 });
    doc.fillColor(GRAY).font('Helvetica')
      .text(' ' + mistake, { width: doc.page.width - 160 });
  });

  // ====== CALENDRIER 30 JOURS ======
  doc.addPage();
  drawPageHeader(doc, 'Chapitre 9', GOLD, DARK);
  drawSubtitle(doc, 'Plan d\'action 30 jours', DARK);
  
  drawParagraph(doc, `Suivez ce calendrier jour par jour. Cochez chaque etape accomplie. La regularite est la cle du succes.`, GRAY);
  
  const weeks = [
    {
      title: 'Semaine 1 : Preparation',
      days: [
        'Jour 1-3 : Nettoyage matin + soir + hydratant uniquement. Observez votre peau.',
        'Jour 4 : Ajoutez le serum vitamine C le matin.',
        'Jour 5 : Ajoutez la creme solaire SPF 30+ le matin.',
        'Jour 6 : Premiere exfoliation douce le soir (AHA ou BHA).',
        'Jour 7 : Jour de repos - masque hydratant maison. Evaluez votre peau.',
      ]
    },
    {
      title: 'Semaine 2 : Construction',
      days: [
        'Jour 8-10 : Continuez la routine de base. Ajoutez le contour des yeux le soir.',
        'Jour 11 : Introduisez le retinol (faible concentration) 1x cette semaine.',
        'Jour 12 : Deuxieme exfoliation de la semaine.',
        'Jour 13 : Masque purifiant.',
        'Jour 14 : Evaluez : moins de brillance ? Plus d\'eclat ? Ajustez si besoin.',
      ]
    },
    {
      title: 'Semaine 3 : Intensification',
      days: [
        'Jour 15-17 : Retinol 2x par semaine maintenant.',
        'Jour 18 : Essayez le double nettoyage le soir.',
        'Jour 19 : Masque eclat au miel et curcuma.',
        'Jour 20 : Augmentez la concentration de vitamine C si toleree.',
        'Jour 21 : Photo de progression ! Comparez avec le jour 1.',
      ]
    },
    {
      title: 'Semaine 4 : Transformation',
      days: [
        'Jour 22-25 : Routine complete installee. Maintenez la regularite.',
        'Jour 26 : Masque anti-age ou hydratant selon votre besoin.',
        'Jour 27 : Evaluez vos resultats. Quels produits vous conviennent le mieux ?',
        'Jour 28-29 : Affinez votre routine definitive.',
        'Jour 30 : Photo finale ! Celebrez votre transformation.',
      ]
    },
  ];
  
  weeks.forEach(week => {
    if (doc.y > doc.page.height - 200) {
      doc.addPage();
      drawPageHeader(doc, 'Calendrier (suite)', GOLD, DARK);
    }
    doc.moveDown(0.8);
    doc.fontSize(14).fillColor(GOLD).font('Helvetica-Bold').text(week.title, 80);
    doc.moveDown(0.3);
    week.days.forEach(day => {
      doc.fontSize(11).fillColor(GRAY).font('Helvetica')
        .text('[ ] ' + day, 90, doc.y, { width: doc.page.width - 170 });
      doc.moveDown(0.2);
    });
  });

  // ====== FAQ ======
  doc.addPage();
  drawPageHeader(doc, 'FAQ', GOLD, DARK);
  drawSubtitle(doc, 'Questions frequentes', DARK);
  
  const faqs = [
    { q: 'Combien de temps avant de voir des resultats ?', a: 'Les premiers changements (hydratation, eclat) apparaissent en 7-14 jours. Les resultats significatifs (taches, rides, texture) en 4-8 semaines. La cle : la patience et la regularite.' },
    { q: 'Puis-je utiliser ces conseils si je suis enceinte ?', a: 'Evitez le retinol et les AHA/BHA forts pendant la grossesse. Consultez votre dermatologue pour une routine adaptee. Le reste du guide (hydratation, SPF, alimentation) est parfaitement adapte.' },
    { q: 'Dois-je acheter des produits chers ?', a: 'Non ! L\'important c\'est les ingredients, pas la marque. Un serum vitamine C a 20$ peut etre aussi efficace qu\'un a 100$. Lisez les etiquettes, pas les publicites.' },
    { q: 'Comment savoir si un produit ne me convient pas ?', a: 'Faites toujours un test sur une petite zone (derriere l\'oreille) 24h avant. Si rougeur, demangeaison ou irritation, arretez. Une legere sensation de picotement avec les AHA est normale.' },
    { q: 'Le masque au citron est-il dangereux ?', a: 'Le citron pur est trop acide (pH 2) pour la peau. Dans nos recettes, il est toujours dilue avec du miel et du blanc d\'oeuf. Ne jamais appliquer de citron pur directement sur le visage.' },
  ];
  
  faqs.forEach(faq => {
    if (doc.y > doc.page.height - 120) {
      doc.addPage();
      drawPageHeader(doc, 'FAQ (suite)', GOLD, DARK);
    }
    doc.moveDown(0.6);
    doc.fontSize(12).fillColor(DARK).font('Helvetica-Bold')
      .text('Q: ' + faq.q, 80, doc.y, { width: doc.page.width - 160 });
    doc.moveDown(0.2);
    doc.fontSize(11).fillColor(GRAY).font('Helvetica')
      .text('R: ' + faq.a, 80, doc.y, { width: doc.page.width - 160 });
  });

  // ====== LAST PAGE ======
  doc.addPage();
  doc.rect(0, 0, doc.page.width, doc.page.height).fill(DARK);
  
  doc.rect(60, 80, doc.page.width - 120, 2).fill(GOLD);
  doc.rect(60, doc.page.height - 82, doc.page.width - 120, 2).fill(GOLD);
  
  doc.fontSize(14).fillColor(GOLD).font('Helvetica')
    .text('L U M E A', 0, 250, { align: 'center', characterSpacing: 8 });
  
  doc.moveDown(2);
  doc.fontSize(28).fillColor('#FFFFFF').font('Helvetica-Bold')
    .text('Merci !', { align: 'center' });
  
  doc.moveDown(1);
  doc.fontSize(14).fillColor('#AAAAAA').font('Helvetica')
    .text('Votre peau vous remerciera.', { align: 'center' });
  doc.text('Commencez des aujourd\'hui.', { align: 'center' });
  
  doc.moveDown(3);
  doc.fontSize(12).fillColor(GOLD).font('Helvetica')
    .text('lumea-boutique.onrender.com', { align: 'center' });
  
  doc.moveDown(1);
  doc.fontSize(10).fillColor('#666666')
    .text('Ce guide est protege par le droit d\'auteur.', { align: 'center' });
  doc.text('Toute reproduction est interdite sans autorisation.', { align: 'center' });
  doc.moveDown(1);
  doc.text('(c) 2025 LUMEA Canada. Tous droits reserves.', { align: 'center' });

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

// ====== HELPER FUNCTIONS ======
function drawPageHeader(doc, text, gold, dark) {
  doc.fontSize(10).fillColor(gold).font('Helvetica')
    .text('LUMEA', 60, 40, { continued: true });
  doc.fillColor('#999999').text('  |  ' + text);
  doc.rect(60, 58, doc.page.width - 120, 0.5).fill(gold);
  doc.moveDown(2);
}

function drawSubtitle(doc, text, color) {
  doc.fontSize(22).fillColor(color).font('Helvetica-Bold')
    .text(text, 80, doc.y, { width: doc.page.width - 160 });
  doc.moveDown(0.8);
}

function drawParagraph(doc, text, color) {
  doc.fontSize(12).fillColor(color).font('Helvetica')
    .text(text, 80, doc.y, { width: doc.page.width - 160, lineGap: 4 });
  doc.moveDown(0.5);
}

function drawQuote(doc, text, gold) {
  doc.moveDown(0.5);
  doc.rect(80, doc.y, 3, 50).fill(gold);
  doc.fontSize(12).fillColor(gold).font('Helvetica-Oblique')
    .text(text, 95, doc.y + 5, { width: doc.page.width - 180 });
  doc.moveDown(1.5);
}

function drawBulletList(doc, items, bulletColor, textColor) {
  items.forEach(item => {
    doc.fontSize(11).fillColor(bulletColor).font('Helvetica')
      .text('  \u2022 ', 80, doc.y, { continued: true, width: 20 });
    doc.fillColor(textColor).text(item, { width: doc.page.width - 180 });
    doc.moveDown(0.2);
  });
}

// Run if called directly
if (require.main === module) {
  generateGuide().then(() => console.log('Done!')).catch(console.error);
}

module.exports = { generateGuide };
