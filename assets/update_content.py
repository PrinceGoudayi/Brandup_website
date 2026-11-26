import re

# services.html - replace the 3 cards block
path = r'c:\Users\jairu\Brandup_website\services.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

old_block = '''      <div class="pricing-grid">
        <!-- Formule 1 -->
        <div class="price-card tilt">
          <img class="thumb-img" src="assets/img/jeweller-hero.jpg" alt="Exemple vitrine" style="width: calc(100% + 60px); margin: -36px -30px 20px; aspect-ratio: 16/10; object-fit: cover; border-bottom: 1px solid var(--border); border-radius: 20px 20px 0 0;" loading="lazy">
          <h3>Pr\u00e9sentation</h3>
          <div class="desc">Pour asseoir votre l\u00e9gitimit\u00e9 et pr\u00e9senter clairement votre valeur aux visiteurs.</div>
          <div class="cost">30 000 <small>FCFA</small></div>'''

new_block_start = '''      <div class="pricing-grid">
        <!-- Formule 1 -->
        <div class="price-card tilt">
          <img class="thumb-img" src="assets/img/jeweller-hero.jpg" alt="Exemple site portfolio" style="width: calc(100% + 60px); margin: -36px -30px 20px; aspect-ratio: 16/10; object-fit: cover; border-bottom: 1px solid var(--border); border-radius: 20px 20px 0 0;" loading="lazy">
          <h3>Portfolio</h3>
          <div class="desc">Votre vitrine digitale\u00a0: qui vous \u00eates, ce que vous faites, pourquoi vous choisir.</div>
          <div class="cost">30 000 <small>FCFA</small></div>'''

content = content.replace(old_block, new_block_start, 1)

# Rename features for card 1
content = content.replace(
    'Page de pr\u00e9sentation compl\u00e8te (Qui, Quoi, T\u00e9moignages)',
    "Page d'accueil + \u00c0 propos + T\u00e9moignages clients", 1)
content = content.replace(
    'Design ultra-r\u00e9actif pens\u00e9 pour mobile',
    "Design pro, ultra-rapide, 100\u00a0% mobile", 1)
content = content.replace(
    "Bouton d'action WhatsApp personnalis\u00e9",
    "Bouton WhatsApp int\u00e9gr\u00e9 et personnalis\u00e9", 1)
content = content.replace(
    "Lien \u00e0 int\u00e9grer dans vos biographies de r\u00e9seaux sociaux",
    "Lien \u00e0 glisser en bio TikTok / Instagram", 1)
content = content.replace(
    'Commander cette formule</a>\n        </div>\n\n        <!-- Formule 2 (Featured) -->',
    'Choisir cette formule</a>\n        </div>\n\n        <!-- Formule 2 (Featured) -->', 1)

# Card 2 rename
content = content.replace(
    '<h3>Catalogue</h3>\n          <div class="desc">Pour exposer l\'ensemble de votre gamme de produits ou services avec leurs prix.</div>',
    '<h3>Site Vitrine</h3>\n          <div class="desc">Votre boutique en ligne s\u00e9curis\u00e9e : exposez vos produits, rassurez vos clients, recevez des commandes.</div>', 1)
content = content.replace(
    'Tout le contenu de la formule Pr\u00e9sentation',
    'Tout le contenu Portfolio inclus', 1)
content = content.replace(
    'Grille de produits d\u00e9taill\u00e9e (photos, fiches et tarifs)',
    'Catalogue produits : photos, fiches & prix clairs', 1)
content = content.replace(
    'Bouton \u00ab\u00a0Commander sur WhatsApp\u00a0\u00bb par article',
    'Bouton \u00ab\u00a0Commander\u00a0\u00bb WhatsApp par produit', 1)
content = content.replace(
    'Section Questions / R\u00e9ponses pour lever les doutes',
    'FAQ int\u00e9gr\u00e9e pour lever tous les doutes d\'achat', 1)
content = content.replace(
    'je%20veux%20la%20formule%20Catalogue" target="_blank" rel="noopener">Commander cette formule</a>\n        </div>\n\n        <!-- Formule 3 -->',
    'je%20veux%20la%20formule%20Site%20Vitrine" target="_blank" rel="noopener">Choisir cette formule</a>\n        </div>\n\n        <!-- Formule 3 -->', 1)

# Card 3 rename
content = content.replace(
    'alt="Exemple cl\u00e9 en main"',
    'alt="Autres services"', 1)
content = content.replace(
    '<h3>Cl\u00e9 en main</h3>\n          <div class="desc">Pour b\u00e9n\u00e9ficier d\'une prise en charge totale : domaine personnalis\u00e9 et h\u00e9bergement.</div>',
    '<h3>Autres Services</h3>\n          <div class="desc">Outils de gestion avanc\u00e9s\u00a0: multi-boutiques, suivi des revenus, tableaux de bord sur mesure.</div>', 1)
content = content.replace(
    'Tout le contenu de la formule Catalogue',
    'Gestion de plusieurs boutiques depuis un seul tableau de bord', 1)
content = content.replace(
    'Nom de domaine propre (.com, .store, .net) offert 1 an',
    'Suivi des revenus et analytics en temps r\u00e9el', 1)
content = content.replace(
    'Configuration &amp; h\u00e9bergement s\u00e9curis\u00e9 inclus',
    'Outils de gestion commandes, stock &amp; livraison', 1)
content = content.replace(
    'Assistance et mises \u00e0 jour prioritaires',
    'Domaine + h\u00e9bergement s\u00e9curis\u00e9 + maintenance inclus', 1)
content = content.replace(
    'je%20veux%20la%20formule%20Cl%C3%A9%20en%20main" target="_blank" rel="noopener">Commander cette formule</a>',
    'je%20suis%20int%C3%A9ress%C3%A9%20par%20vos%20autres%20services" target="_blank" rel="noopener">Discuter du projet</a>', 1)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print('services.html updated')

# Now update qui-sommes-nous.html team section
path2 = r'c:\Users\jairu\Brandup_website\qui-sommes-nous.html'
with open(path2, 'r', encoding='utf-8') as f:
    c2 = f.read()

team_section_new = '''      <div class="team-list">
        <!-- Membre 1 - Le Prince (Marketing & Communication) -->
        <div class="team-card tilt">
          <div class="team-photo-col">
            <div class="team-photo-box">
              <div class="team-photo-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span>Photo \u00e0 venir</span>
              </div>
            </div>
          </div>
          <div class="team-bio-col">
            <span class="team-badge">Co-fondateur</span>
            <h3 class="team-name">Le Prince</h3>
            <div class="team-role">Strat\u00e9gie Marketing &amp; Relation Client</div>
            <p class="team-desc">
              Le Prince est le visage et la voix de BrandUp. Il assure la relation directe avec chaque client, comprend leurs besoins en profondeur et pilote la strat\u00e9gie de communication de l\u2019agence. C\u2019est lui qui transforme une id\u00e9e floue en un brief clair, et qui s\u2019assure que chaque projet d\u00e9passe les attentes initiales du client.
            </p>
            <div class="team-tags">
              <span>Marketing Digital</span>
              <span>Relation Client</span>
              <span>Strat\u00e9gie de Contenu</span>
              <span>Community Management</span>
            </div>
          </div>
        </div>

        <!-- Membre 2 - Ja\u00efrius Prince Goudayi -->
        <div class="team-card tilt">
          <div class="team-photo-col">
            <div class="team-photo-box">
              <img src="assets/img/image.png" alt="Ja\u00efrius Prince Goudayi" style="object-position: center top;">
            </div>
          </div>
          <div class="team-bio-col">
            <span class="team-badge">Co-fondateur &amp; Ing\u00e9nieur</span>
            <h3 class="team-name">Ja\u00efrius Prince Goudayi</h3>
            <div class="team-role">D\u00e9veloppement Web &amp; Architecture Logicielle</div>
            <p class="team-desc">
              Dipl\u00f4m\u00e9 du Bachelor d\u2019Epitech B\u00e9nin en g\u00e9nie logiciel, Ja\u00efrius est l\u2019architecte technique de BrandUp. Il ma\u00eetrise le d\u00e9veloppement web full-stack, la s\u00e9curit\u00e9 applicative et l\u2019intelligence artificielle. Contributeur du projet <strong>IWEY</strong> \u2014 plateforme de gestion de cours en ligne pour universit\u00e9s \u2014 il con\u00e7oit des syst\u00e8mes robustes, \u00e9volutifs et orient\u00e9s r\u00e9sultats. Son objectif\u00a0: des solutions innovantes qui r\u00e9pondent \u00e0 des probl\u00e9matiques concr\u00e8tes pour sa communaut\u00e9.
            </p>
            <div class="team-tags">
              <span>D\u00e9veloppement Web</span>
              <span>Architecture Logicielle</span>
              <span>Cybers\u00e9curit\u00e9</span>
              <span>Intelligence Artificielle</span>
              <span>Machine Learning</span>
            </div>
            <div style="margin-top: 16px;">
              <a class="btn btn-outline btn-sm" href="https://portofolio-blond-one-93.vercel.app/" target="_blank" rel="noopener" style="display: inline-flex; align-items: center; gap: 8px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                Voir le portfolio
              </a>
            </div>
          </div>
        </div>
      </div>'''

old_team = '''      <div class="team-list">
        <!-- Membre 1 -->
        <div class="team-card tilt">
          <div class="team-photo-col">
            <div class="team-photo-box">
              <div class="team-photo-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span>Photo Fondateur</span>
              </div>
            </div>
          </div>
          <div class="team-bio-col">
            <span class="team-badge">Co-fondateur</span>
            <h3 class="team-name">[Pr\u00e9nom &amp; Nom]</h3>
            <div class="team-role">Conception Web &amp; Strat\u00e9gie Digitale</div>
            <p class="team-desc">
              Sp\u00e9cialiste de l\'exp\u00e9rience utilisateur et de l\'architecture web. Je m\'assure que chaque plateforme con\u00e7ue par BrandUp se charge instantan\u00e9ment, offre une navigation fluide et guide naturellement le visiteur vers l\'action commerciale.
            </p>
            <div class="team-tags">
              <span>Conception Web</span>
              <span>D\u00e9veloppement Mobile</span>
              <span>Tunnel de Vente</span>
              <span>Performance &amp; SEO</span>
            </div>
          </div>
        </div>

        <!-- Membre 2 -->
        <div class="team-card tilt">
          <div class="team-photo-col">
            <div class="team-photo-box">
              <div class="team-photo-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span>Photo Fondateur</span>
              </div>
            </div>
          </div>
          <div class="team-bio-col">
            <span class="team-badge">Co-fondateur</span>
            <h3 class="team-name">[Pr\u00e9nom &amp; Nom]</h3>
            <div class="team-role">Direction Artistique &amp; Motion Design</div>
            <p class="team-desc">
              Directeur cr\u00e9atif passionn\u00e9 par l\'image de marque et l\'animation vid\u00e9o. Je con\u00e7ois des identit\u00e9s graphiques affirm\u00e9es et des contenus motion design modernes qui captivent l\'audience et valorisent l\'expertise de nos clients.
            </p>
            <div class="team-tags">
              <span>Direction Artistique</span>
              <span>Motion Design 2D/3D</span>
              <span>Logos &amp; Chartes Graphiques</span>
              <span>Visuels Publicitaires</span>
            </div>
          </div>
        </div>
      </div>'''

c2 = c2.replace(old_team, team_section_new, 1)
with open(path2, 'w', encoding='utf-8') as f:
    f.write(c2)
print('qui-sommes-nous.html updated')
