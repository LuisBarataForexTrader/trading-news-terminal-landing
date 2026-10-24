#!/usr/bin/env python3
"""Adiciona o link CRAWLAVEL do canal YouTube ao footer de TODAS as paginas em public/.
Idempotente (marcador `footer-yt` -> nao duplica). Correr sempre que se criarem paginas novas:
    python3 scripts/add-youtube-footer.py
Insere antes de </footer> (preferido) ou </body> (fallback). Salta paginas utilitarias.
NB: faz-se em HTML ESTATICO de proposito (nao via middleware/funcao Cloudflare) para nao
gastar invocacoes de funcao e rebentar o limite diario de Workers+Pages Functions.
As paginas de /ticker/* ja levam o link pelo proprio gerador (scripts/generate-tickers.js).
"""
import glob, os
ROOT = os.path.join(os.path.dirname(__file__), "..", "public")
EXCLUDE = {"admin.html", "login.html", "signin.html", "widget-preview.html"}
SNIP = ('<div class="footer-yt" style="text-align:center;padding:14px 16px;font-size:12px;opacity:.75">'
        '<a href="https://www.youtube.com/@tradingnewsterminal" target="_blank" rel="noopener" '
        'style="color:inherit">Trading News Terminal on YouTube</a></div>\n')
added = skipped = nofit = 0
for p in sorted(glob.glob(os.path.join(ROOT, "*.html"))):
    if os.path.basename(p) in EXCLUDE:
        continue
    s = open(p, encoding="utf-8").read()
    if "footer-yt" in s:
        skipped += 1; continue
    i = s.rfind("</footer>")
    if i < 0:
        i = s.rfind("</body>")
    if i < 0:
        nofit += 1; print("  sem ponto de insercao:", os.path.basename(p)); continue
    open(p, "w", encoding="utf-8").write(s[:i] + SNIP + s[i:])
    added += 1
print(f"adicionado: {added} | ja tinha: {skipped} | sem ponto: {nofit}")
