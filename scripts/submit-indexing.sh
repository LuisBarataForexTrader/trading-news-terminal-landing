#!/usr/bin/env bash
# Submit all new SEO landing URLs to Google Indexing API via TNT backend
# Requires: ADMIN_TOKEN env var
# Usage:  ADMIN_TOKEN=xxxx bash scripts/submit-indexing.sh
set -euo pipefail

BASE="https://www.tradingnewsterminal.com"
API="https://api.tradingnewsterminal.com"

if [[ -z "${ADMIN_TOKEN:-}" ]]; then
  echo "ERROR: ADMIN_TOKEN env var required" >&2
  exit 1
fi

# URL list — all 46 new landing pages from current SEO sprint
URLS=(
  # Tier 1 — Unique US features (EN)
  "$BASE/sec-edgar-live-alerts"
  "$BASE/8-k-filing-alerts"
  "$BASE/13f-filing-tracker"
  "$BASE/ai-earnings-call-summary"
  "$BASE/reddit-wsb-sentiment-tracker"
  "$BASE/pre-market-news-feed"
  "$BASE/after-hours-earnings-tracker"

  # Tier 2 — BR-specific (PT-BR)
  "$BASE/copom-decisao-selic-alertas"
  "$BASE/copom-calendario-2026"
  "$BASE/petrobras-noticias-tempo-real"
  "$BASE/vale-noticias-tempo-real"
  "$BASE/ibovespa-noticias-ao-vivo"
  "$BASE/dolar-real-noticias"
  "$BASE/balanco-petrobras-vale-ia"
  "$BASE/squawk-em-portugues"

  # Tier 3 — Per-ticker programmatic (BR top 15)
  "$BASE/ticker/PETR4"
  "$BASE/ticker/VALE3"
  "$BASE/ticker/ITUB4"
  "$BASE/ticker/BBAS3"
  "$BASE/ticker/BBDC4"
  "$BASE/ticker/ABEV3"
  "$BASE/ticker/WEGE3"
  "$BASE/ticker/B3SA3"
  "$BASE/ticker/JBSS3"
  "$BASE/ticker/PRIO3"
  "$BASE/ticker/MGLU3"
  "$BASE/ticker/RENT3"
  "$BASE/ticker/SUZB3"
  "$BASE/ticker/RAIL3"
  "$BASE/ticker/EQTL3"

  # Tier 3 — Per-ticker programmatic (US top 15)
  "$BASE/ticker/AAPL"
  "$BASE/ticker/NVDA"
  "$BASE/ticker/TSLA"
  "$BASE/ticker/MSFT"
  "$BASE/ticker/GOOGL"
  "$BASE/ticker/META"
  "$BASE/ticker/AMZN"
  "$BASE/ticker/AMD"
  "$BASE/ticker/NFLX"
  "$BASE/ticker/AVGO"
  "$BASE/ticker/JPM"
  "$BASE/ticker/GME"
  "$BASE/ticker/COIN"
  "$BASE/ticker/PLTR"
  "$BASE/ticker/SMCI"

  # Ticker index
  "$BASE/ticker"
)

echo "Submitting ${#URLS[@]} URLs to Google Indexing API via $API/admin/seo/indexing-notify"

# Build JSON array
URLS_JSON=$(printf '%s\n' "${URLS[@]}" | python3 -c 'import sys, json; print(json.dumps([l.strip() for l in sys.stdin if l.strip()]))')

curl -sS -X POST "$API/admin/seo/indexing-notify" \
  -H "x-admin-token: $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"urls\": $URLS_JSON}" \
  | python3 -m json.tool
