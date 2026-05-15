#!/usr/bin/env bash
# Submit all 46 new SEO landing URLs to IndexNow (Bing, Yandex, Seznam).
# IndexNow is a free pingomatic-style service — no auth, instant. Used by
# Microsoft Bing and Yandex out of the box; Google has not adopted it yet.
#
# Setup: the host /ea79489657a4867277e01e156f6c4adc.txt must serve the literal
# string "ea79489657a4867277e01e156f6c4adc" so IndexNow can verify ownership.
set -euo pipefail

KEY="ea79489657a4867277e01e156f6c4adc"
HOST="www.tradingnewsterminal.com"
KEY_LOC="https://$HOST/$KEY.txt"

URLS_JSON=$(cat <<'EOF'
[
  "https://www.tradingnewsterminal.com/sec-edgar-live-alerts",
  "https://www.tradingnewsterminal.com/8-k-filing-alerts",
  "https://www.tradingnewsterminal.com/13f-filing-tracker",
  "https://www.tradingnewsterminal.com/ai-earnings-call-summary",
  "https://www.tradingnewsterminal.com/reddit-wsb-sentiment-tracker",
  "https://www.tradingnewsterminal.com/pre-market-news-feed",
  "https://www.tradingnewsterminal.com/after-hours-earnings-tracker",
  "https://www.tradingnewsterminal.com/copom-decisao-selic-alertas",
  "https://www.tradingnewsterminal.com/copom-calendario-2026",
  "https://www.tradingnewsterminal.com/petrobras-noticias-tempo-real",
  "https://www.tradingnewsterminal.com/vale-noticias-tempo-real",
  "https://www.tradingnewsterminal.com/ibovespa-noticias-ao-vivo",
  "https://www.tradingnewsterminal.com/dolar-real-noticias",
  "https://www.tradingnewsterminal.com/balanco-petrobras-vale-ia",
  "https://www.tradingnewsterminal.com/squawk-em-portugues",
  "https://www.tradingnewsterminal.com/ticker",
  "https://www.tradingnewsterminal.com/ticker/PETR4",
  "https://www.tradingnewsterminal.com/ticker/VALE3",
  "https://www.tradingnewsterminal.com/ticker/ITUB4",
  "https://www.tradingnewsterminal.com/ticker/BBAS3",
  "https://www.tradingnewsterminal.com/ticker/BBDC4",
  "https://www.tradingnewsterminal.com/ticker/ABEV3",
  "https://www.tradingnewsterminal.com/ticker/WEGE3",
  "https://www.tradingnewsterminal.com/ticker/B3SA3",
  "https://www.tradingnewsterminal.com/ticker/JBSS3",
  "https://www.tradingnewsterminal.com/ticker/PRIO3",
  "https://www.tradingnewsterminal.com/ticker/MGLU3",
  "https://www.tradingnewsterminal.com/ticker/RENT3",
  "https://www.tradingnewsterminal.com/ticker/SUZB3",
  "https://www.tradingnewsterminal.com/ticker/RAIL3",
  "https://www.tradingnewsterminal.com/ticker/EQTL3",
  "https://www.tradingnewsterminal.com/ticker/AAPL",
  "https://www.tradingnewsterminal.com/ticker/NVDA",
  "https://www.tradingnewsterminal.com/ticker/TSLA",
  "https://www.tradingnewsterminal.com/ticker/MSFT",
  "https://www.tradingnewsterminal.com/ticker/GOOGL",
  "https://www.tradingnewsterminal.com/ticker/META",
  "https://www.tradingnewsterminal.com/ticker/AMZN",
  "https://www.tradingnewsterminal.com/ticker/AMD",
  "https://www.tradingnewsterminal.com/ticker/NFLX",
  "https://www.tradingnewsterminal.com/ticker/AVGO",
  "https://www.tradingnewsterminal.com/ticker/JPM",
  "https://www.tradingnewsterminal.com/ticker/GME",
  "https://www.tradingnewsterminal.com/ticker/COIN",
  "https://www.tradingnewsterminal.com/ticker/PLTR",
  "https://www.tradingnewsterminal.com/ticker/SMCI"
]
EOF
)

BODY=$(python3 -c "
import json, sys
urls = json.loads('''$URLS_JSON''')
body = {
    'host': '$HOST',
    'key': '$KEY',
    'keyLocation': '$KEY_LOC',
    'urlList': urls,
}
print(json.dumps(body))
")

echo "Submitting 46 URLs to IndexNow (Bing + Yandex + Seznam)..."

# Try Bing first (canonical endpoint)
echo "→ api.indexnow.org:"
curl -sS -i -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d "$BODY" | head -10

echo ""
echo "→ Bing direct:"
curl -sS -i -X POST "https://www.bing.com/indexnow" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d "$BODY" | head -5

echo ""
echo "→ Yandex direct:"
curl -sS -i -X POST "https://yandex.com/indexnow" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d "$BODY" | head -5
