import os, re
files = [
    r'c:\Users\jairu\Brandup_website\index.html',
    r'c:\Users\jairu\Brandup_website\qui-sommes-nous.html'
]
for p in files:
    c = open(p, encoding='utf-8').read()
    # Update name
    c = c.replace('>Le Prince</h3>', '>HOUNTOHOTEGBE Jean-Philippe Le Prince Sedjro</h3>')
    # Replace placeholder div with real photo img for Le Prince card only (first occurrence)
    old = (
        '<div class="team-photo-placeholder">\n'
        '                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'
        '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>\n'
        '                <span>Photo \u00e0 venir</span>\n'
        '              </div>'
    )
    new = '<img src="assets/img/image copy.png" alt="Le Prince" style="object-position: center top;">'
    c = c.replace(old, new, 1)
    open(p, 'w', encoding='utf-8').write(c)
    print('done:', os.path.basename(p))
