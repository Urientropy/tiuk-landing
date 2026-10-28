from pathlib import Path
root = Path(__file__).parent
page = (root / 'source/index.template').read_text()
page = page.replace('<link rel="stylesheet" href="film.css">', '<style>\n' + (root / 'film.css').read_text() + '\n</style>')
page = page.replace('<script src="film.js"></script>', '<script>\n' + (root / 'film.js').read_text() + '\n</script>')
(root / 'index.html').write_text(page)
