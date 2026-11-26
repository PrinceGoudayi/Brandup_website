import os

fouc_script = '<script>if(localStorage.getItem("bu-theme")==="light")document.body.classList.add("light");</script>'

base = r'c:\Users\jairu\Brandup_website'
files = ['index.html', 'services.html', 'portfolio.html', 'qui-sommes-nous.html']
for f in files:
    path = os.path.join(base, f)
    with open(path, 'r', encoding='utf-8') as fh:
        content = fh.read()
    if fouc_script not in content:
        content = content.replace('</head>', fouc_script + '\n</head>', 1)
        with open(path, 'w', encoding='utf-8') as fh:
            fh.write(content)
        print('FOUC fix added:', f)
    else:
        print('Already done:', f)
