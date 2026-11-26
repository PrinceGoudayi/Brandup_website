import os

toggle_btn = (
    '      <button class="theme-toggle" aria-label="Basculer mode clair/sombre">\n'
    '        <svg class="icon-moon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
    '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>\n'
    '        <svg class="icon-sun" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
    '<circle cx="12" cy="12" r="5"/>'
    '<line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>'
    '<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>'
    '<line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>'
    '<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>\n'
    '      </button>'
)

old_anchor = '      </button>\n    </div>\n  </header>'
new_anchor = '      </button>\n' + toggle_btn + '\n    </div>\n  </header>'

base = r'c:\Users\jairu\Brandup_website'
files = ['index.html', 'services.html', 'portfolio.html', 'qui-sommes-nous.html']
for f in files:
    path = os.path.join(base, f)
    with open(path, 'r', encoding='utf-8') as fh:
        content = fh.read()
    if 'theme-toggle' not in content:
        updated = content.replace(old_anchor, new_anchor, 1)
        with open(path, 'w', encoding='utf-8') as fh:
            fh.write(updated)
        print('Updated:', f)
    else:
        print('Already has toggle:', f)
