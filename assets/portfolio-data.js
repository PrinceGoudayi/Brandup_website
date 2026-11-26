/* ============================================================
   PORTFOLIO BRANDUP — ajouter un projet = ajouter un bloc ci-dessous.
   cat   : "web" | "motion" | "logo" | "affiche"
   type  : "realisation" (travail réalisé pour un client ou pour BrandUp)
           "inspiration" (référence de style, pas un travail livré)
   img   : image affichée dans la galerie 3D (chemin dans assets/img/)
   full  : image affichée en grand quand on clique (facultatif)
   url   : lien vers le site en ligne (facultatif)
   ============================================================ */
window.BU_PORTFOLIO = [
  { id: 'cloud',   cat: 'web',     type: 'inspiration', title: 'Boutique sneakers — « Cloud »', desc: 'Référence de style : héros plein écran, produit en 3D, un seul bouton d\'action.', img: 'assets/img/nike-site.jpg', full: 'assets/img/nike-full.jpg', url: '' },
  { id: 'nexora',  cat: 'web',     type: 'inspiration', title: 'Catalogue mode — « Nexora »',   desc: 'Référence de style : collection, produit vedette et prix visibles dès l\'écran d\'accueil.', img: 'assets/img/nexora-site.jpg', full: 'assets/img/nexora-full.jpg', url: '' },
  { id: 'jeweller', cat: 'web',    type: 'inspiration', title: 'Vitrine bijouterie — « Jeweller »', desc: 'Référence de style : fond sombre, détails dorés, galerie de produits en mosaïque.', img: 'assets/img/jeweller-hero.jpg', full: 'assets/img/jeweller-full.jpg', url: '' },
  { id: 'notif',   cat: 'motion',  type: 'inspiration', title: 'Motion design — « New Client »', desc: 'Référence de style : notifications 3D qui s\'empilent, idéal pour un teaser de 10 secondes.', img: 'assets/img/notif-clients.jpg', full: 'assets/img/notif-clients.jpg', url: '' },
  { id: 'icon',    cat: 'logo',    type: 'realisation', title: 'Logo BrandUp — le guépard',      desc: 'Notre propre identité : un guépard pour la vitesse, une flèche pour la progression.', img: 'assets/brandup-icon.png', full: 'assets/brandup-icon.png', url: '' },
  { id: 'word',    cat: 'logo',    type: 'realisation', title: 'Logotype BrandUp',               desc: 'La version complète du logo avec le mot-symbole.', img: 'assets/brandup-wordmark.jpg', full: 'assets/brandup-wordmark.jpg', url: '' },
  { id: 'padi',    cat: 'affiche', type: 'inspiration', title: 'Affiche — « Message your padi »', desc: 'Référence de style : illustration plate, texte court, un message clair.', img: 'assets/img/padi-poster.jpg', full: 'assets/img/padi-poster.jpg', url: '' }
];
window.BU_CATS = { web: 'Conception & design', motion: 'Motion design', logo: 'Logo', affiche: 'Affiche' };
