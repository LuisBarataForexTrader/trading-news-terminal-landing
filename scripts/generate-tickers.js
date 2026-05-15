#!/usr/bin/env node
// Programmatic generator for /ticker/<SYMBOL>.html pages
// Reads scripts/tickers.json and writes one HTML per ticker into public/ticker/

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CONFIG = path.join(__dirname, 'tickers.json');
const OUT_DIR = path.join(ROOT, 'public', 'ticker');

const cfg = JSON.parse(fs.readFileSync(CONFIG, 'utf8'));

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const COPY = {
  'pt-BR': {
    nav_sub: 'Notícias',
    cta_top: 'Testar Grátis →',
    cta_hero: 'Abrir Feed no App',
    cta_demo: 'Ver Notícias ao Vivo',
    cta_footer: 'Abrir Trading News Terminal →',
    price_note: 'Filtro grátis no Basic · <strong>Pro adiciona resumo de balanço com IA, alertas Telegram, webhook e overlay macro</strong>',
    stats: [
      ['&lt;30s', 'Fonte → feed'],
      ['~400ms', 'Resumo IA (Pro)'],
      ['8', 'Línguas suportadas']
    ],
    sec_live_label: 'Notícias ao Vivo',
    sec_live_title: (s) => `Últimas headlines · ${s}`,
    sec_live_intro: (s) => `Headlines recentes do feed para <strong>${s}</strong> — em PT-BR quando disponível. Atualiza a cada 60 segundos. Para o feed completo com filtros, alertas Telegram e resumo de balanço com IA, abre o app.`,
    sec_live_loading: 'A carregar headlines…',
    sec_live_empty: (s) => `Sem headlines recentes para ${s}. Tenta de novo em alguns minutos ou abre o app para ver o feed completo de outros tickers.`,
    sec_live_error: 'Não foi possível carregar o feed agora. Tenta refrescar a página em alguns segundos.',
    sec_live_cta: 'Ver feed completo no app →',
    sec_live_relative: { just_now: 'agora', m: 'min', h: 'h', d: 'd' },
    sec_drivers_label: 'O Que Move',
    sec_drivers_title: (s, n) => `O que move ${s} (${n})`,
    sec_drivers_intro: 'Quatro famílias de catalisadores. Saber qual está em curso evita mistakes de tese.',
    sec_guide_label: 'O Guia',
    sec_guide_title: (s) => `Como acompanhar ${s} sem perder nada`,
    sec_events_h: 'Eventos-chave do calendário',
    sec_events_intro: 'Estes são os eventos que historicamente movem o ticker. Adicione lembrete no calendário do app para não perder.',
    sec_workflow_h: 'Workflow no TNT',
    sec_workflow_p: (s) => `Adicione <strong>${s}</strong> à sua watchlist clicando na estrela ao lado do ticker. Configure alerta Telegram em <em>Configurações → Alertas</em>. Para resumo de balanço com IA (Pro), clique em "Balanço" na aba lateral do detalhe do ticker quando um release sair. O squawk em PT-BR (Pro) lê headlines em voz neural — útil em pré-abertura.`,
    sec_faq_label: 'FAQ',
    sec_faq_h: 'Dúvidas comuns',
    faq: (s, n) => [
      [`Como ver notícias de ${s} em tempo real?`, `Clique no badge ${s} na barra de busca ou digite ${s} e Enter. O feed filtra para mostrar apenas notícias da ${n}. Cobertura inclui fato relevante via CVM/B3 (para empresas brasileiras) ou SEC EDGAR (para empresas US-listed), wires de PR Newswire e BusinessWire, dados operacionais.`],
      [`O alerta no Telegram cobre ${s}?`, `Sim. Adicione ${s} à watchlist clicando na estrela. Vincule o bot Telegram (link em Configurações → Integrações). Você recebe apenas headlines onde ${s} está mencionada.`],
      [`Tem resumo de balanço com IA?`, `Sim, no plano Pro. Quando um release de resultados é publicado, geramos um resumo de 5 bullets em PT-BR em ~400ms. Cobre receita, EBITDA, operacional, dividendos e guidance.`],
      [`É grátis?`, `Filtro de ticker e feed básico: grátis no Basic. Pro ($44/mês ou $33/mês anual) adiciona resumo de balanço com IA, alertas Telegram, webhook, overlay macro e squawk em PT-BR.`]
    ],
    sec_related_label: 'Relacionado',
    sec_related_h: 'Mais cobertura',
    footer_cta_h: (s) => `Configure o feed ${s} em 30 segundos`,
    footer_cta_p: (s) => `Abra o app, clique no badge ${s}. Adicione à watchlist. Vincule o Telegram para alertas.`,
    footer_copy: (s, n) => `© Trading News Terminal — Notícias ${n} (${s}) em tempo real com resumo de balanço por IA`,
    footer_links: ['Site Principal', 'Edição Brasil', 'US Edition', 'Termos', 'Privacidade', 'FAQ']
  },
  'en': {
    nav_sub: 'News Feed',
    cta_top: 'Try Free →',
    cta_hero: 'Open Feed in App',
    cta_demo: 'See Live News',
    cta_footer: 'Open Trading News Terminal →',
    price_note: 'Ticker filter free on Basic · <strong>Pro adds AI earnings summary, Telegram alerts, webhook, macro overlay</strong>',
    stats: [
      ['&lt;15s', 'EDGAR → feed'],
      ['~400ms', 'AI summary (Pro)'],
      ['∞', 'US-listed coverage']
    ],
    sec_live_label: 'Live News',
    sec_live_title: (s) => `Latest headlines · ${s}`,
    sec_live_intro: (s) => `Recent headlines from the live feed for <strong>${s}</strong>. Refreshes every 60 seconds. For the full feed with filters, Telegram alerts and AI earnings summary, open the app.`,
    sec_live_loading: 'Loading headlines…',
    sec_live_empty: (s) => `No recent headlines for ${s}. Try again in a few minutes or open the app for the full feed across other tickers.`,
    sec_live_error: 'Could not load the feed right now. Try refreshing the page in a few seconds.',
    sec_live_cta: 'See full feed in app →',
    sec_live_relative: { just_now: 'just now', m: 'm', h: 'h', d: 'd' },
    sec_drivers_label: 'What Moves It',
    sec_drivers_title: (s, n) => `What moves ${s} (${n})`,
    sec_drivers_intro: 'Four families of catalysts. Knowing which one is in play avoids thesis mistakes.',
    sec_guide_label: 'The Guide',
    sec_guide_title: (s) => `How to follow ${s} without missing anything`,
    sec_events_h: 'Key calendar events',
    sec_events_intro: 'These are the events that historically move the ticker. Add to your app calendar so you do not miss them.',
    sec_workflow_h: 'Workflow in TNT',
    sec_workflow_p: (s) => `Add <strong>${s}</strong> to your watchlist via the star next to the ticker. Configure Telegram alerts in <em>Settings → Alerts</em>. For the AI earnings summary (Pro), click "Earnings" in the ticker detail panel when a new release lands. Squawk audio in English (Pro) reads headlines via neural voice — useful pre-market.`,
    sec_faq_label: 'FAQ',
    sec_faq_h: 'Frequently asked questions',
    faq: (s, n) => [
      [`How do I see ${s} news in real time?`, `Click the ${s} badge in the search bar or type ${s} and Enter. The feed filters to show only ${n} news. Coverage includes SEC EDGAR (8-K, 10-Q, 10-K, 13F, 13D/G), PR Newswire and BusinessWire wires, FDA announcements where relevant, and analyst rating changes.`],
      [`Does the Telegram alert cover ${s}?`, `Yes. Add ${s} to your watchlist by clicking the star. Link the Telegram bot (link in Settings → Integrations). You receive only headlines mentioning ${s}.`],
      [`Is there an AI earnings summary?`, `Yes, on the Pro plan. When an 8-K Item 2.02 earnings release lands, we generate a 5-bullet AI summary in ~400ms covering revenue, margins, risks, Q&A topic, and sentiment.`],
      [`Is it free?`, `Ticker filter and basic news feed: free on Basic. Pro ($44/mo or $33/mo annual) adds AI earnings summary, Telegram alerts, webhook, macro overlay and English squawk.`]
    ],
    sec_related_label: 'Related',
    sec_related_h: 'More coverage',
    footer_cta_h: (s) => `Set up the ${s} feed in 30 seconds`,
    footer_cta_p: (s) => `Open the app, click the ${s} badge. Add to watchlist. Link Telegram for alerts.`,
    footer_copy: (s, n) => `© Trading News Terminal — Real-time ${n} (${s}) news with AI earnings summary`,
    footer_links: ['Main Site', '🇧🇷 Edição Brasil', '🇺🇸 US Edition', 'Terms', 'Privacy', 'FAQ']
  }
};

function buildTickerCloud(currentSymbol, allTickers, region) {
  const sameRegion = allTickers.filter(t => t.region === region && t.symbol !== currentSymbol).slice(0, 12);
  const otherRegion = allTickers.filter(t => t.region !== region).slice(0, 4);
  return [...sameRegion, ...otherRegion].slice(0, 14);
}

function renderPage(t, allTickers) {
  const c = COPY[t.lang === 'pt-BR' ? 'pt-BR' : 'en'];
  const symbol = t.symbol;
  const name = t.name;
  const sector = t.sector;
  const exchange = t.exchange;
  const region = t.region;
  const intro = t.intro;
  const lang = t.lang;
  const ariaLang = lang === 'pt-BR' ? 'pt-BR' : 'en';
  const url = `https://www.tradingnewsterminal.com/ticker/${symbol}`;

  // Build driver cards
  const driverCards = t.drivers.map(([h, p]) => `<div class="card"><h3>${esc(h)}</h3><p>${esc(p)}</p></div>`).join('\n      ');

  // Build event list
  const eventList = t.key_events.map(e => `<li>${esc(e)}</li>`).join('\n        ');

  // Build FAQ
  const faqList = c.faq(symbol, name).map(([q, a]) => `<div class="faq-item"><h3>${esc(q)}</h3><p>${esc(a)}</p></div>`).join('\n      ');

  // Build related SEO links
  const relatedSeo = t.related_seo.map(([href, label]) => `<a href="${href}" class="explore-link"><span class="arrow">→</span> ${esc(label)}</a>`).join('\n      ');

  // Build ticker cloud
  const cloud = buildTickerCloud(symbol, allTickers, region);
  const cloudLinks = cloud.map(tk => `<a href="/ticker/${tk.symbol}" class="ticker-chip"><strong>${tk.symbol}</strong> <span>${esc(tk.name)}</span></a>`).join('\n      ');

  // Schema.org
  const schemaFaq = c.faq(symbol, name).map(([q, a]) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a }
  }));
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: `Trading News Terminal — ${symbol} (${name})`,
        url,
        inLanguage: ariaLang,
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web Browser',
        description: t.description,
        offers: [{ '@type': 'Offer', name: 'Pro Monthly', price: '44', priceCurrency: 'USD', billingIncrement: 'P1M' }]
      },
      { '@type': 'FAQPage', mainEntity: schemaFaq },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.tradingnewsterminal.com/' },
          { '@type': 'ListItem', position: 2, name: region === 'BR' ? 'Edição Brasil' : 'US Edition', item: `https://www.tradingnewsterminal.com/${region === 'BR' ? 'br' : 'us'}` },
          { '@type': 'ListItem', position: 3, name: symbol, item: url }
        ]
      }
    ]
  };

  const langAttr = lang === 'pt-BR' ? 'pt-BR' : 'en';
  const flag = region === 'BR' ? '🇧🇷' : '🇺🇸';
  const utmLang = lang === 'pt-BR' ? '&lang=pt' : '';
  const navSub = `${flag} ${symbol}`;

  return `<!DOCTYPE html>
<html lang="${langAttr}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(t.headline)}</title>
<meta name="description" content="${esc(t.description)}">
<meta name="keywords" content="${symbol.toLowerCase()} news, ${symbol.toLowerCase()} earnings, ${symbol.toLowerCase()} stock price, ${name.toLowerCase()} stock, ${symbol.toLowerCase()} alert, ${symbol.toLowerCase()} live feed, ${symbol.toLowerCase()} balanço, ${symbol.toLowerCase()} dividendos">
<link rel="canonical" href="${url}">
<meta name="robots" content="index, follow">
<link rel="icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<meta name="theme-color" content="#0a0c0f">
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(t.headline)}">
<meta property="og:description" content="${esc(t.description)}">
<meta property="og:image" content="https://www.tradingnewsterminal.com/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${JSON.stringify(schema)}</script>
<style>
  :root{--bg:#0a0c0f;--card:#0f1218;--border:#1a2230;--text:#e2e8f0;--text-muted:#6b7d92;--muted:#8899aa;--accent:#00d4ff;--purple:#a78bfa;--green:#10b981;--orange:#f59e0b;--gold:#fcd34d}
  *{margin:0;padding:0;box-sizing:border-box}body{background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,"Inter","Segoe UI",Roboto,sans-serif;line-height:1.6;-webkit-font-smoothing:antialiased}
  a{color:var(--accent);text-decoration:none}a:hover{text-decoration:underline}.container{max-width:1180px;margin:0 auto;padding:0 24px}
  nav{padding:18px 32px;border-bottom:1px solid var(--border);position:sticky;top:0;background:rgba(10,12,15,0.92);backdrop-filter:blur(8px);z-index:50;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}
  .nav-logo{display:flex;align-items:center;gap:12px;color:var(--text)}.nav-logo-icon{width:32px;height:32px;border:1.5px solid var(--accent);display:flex;align-items:center;justify-content:center;flex-shrink:0}.nav-logo-icon::before{content:'';width:10px;height:10px;background:var(--accent);animation:tnt-pulse 2s ease-in-out infinite}@keyframes tnt-pulse{0%,100%{opacity:1}50%{opacity:.4}}
  .nav-logo-text{font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;line-height:1.3}.nav-logo-text span{color:var(--accent)}.nav-logo-sub{font-size:9px;color:var(--text-muted);letter-spacing:.1em;text-transform:uppercase}
  .btn{display:inline-block;padding:11px 22px;border-radius:6px;font-weight:700;font-size:13px;letter-spacing:.04em;cursor:pointer;transition:all .15s;border:none;text-transform:uppercase}.btn:hover{transform:translateY(-1px);box-shadow:0 6px 24px rgba(0,212,255,.2);text-decoration:none}
  .btn-primary{background:var(--accent);color:#002030}.btn-outline{background:transparent;color:var(--text);border:1px solid var(--border)}.btn-outline:hover{border-color:var(--accent);color:var(--accent)}.btn-lg{padding:15px 32px;font-size:14px}
  .hero{padding:60px 0 48px;text-align:center}.topic-badge{display:inline-flex;align-items:center;gap:7px;padding:6px 14px;background:rgba(0,212,255,.1);border:1px solid rgba(0,212,255,.35);color:var(--accent);border-radius:999px;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;margin-bottom:24px}
  .ticker-h{font-family:monospace;font-size:clamp(46px,8vw,76px);font-weight:800;color:var(--accent);line-height:1;margin-bottom:6px;letter-spacing:-.02em}
  .name-sub{font-size:clamp(16px,2vw,20px);color:var(--muted);margin-bottom:22px}
  h1{font-size:clamp(24px,3.5vw,34px);font-weight:800;line-height:1.18;margin-bottom:18px;letter-spacing:-.015em;max-width:880px;margin-left:auto;margin-right:auto}
  .meta-row{display:flex;justify-content:center;gap:20px;margin-bottom:24px;flex-wrap:wrap;font-size:12.5px;color:var(--muted)}
  .meta-row span{padding:5px 12px;background:var(--card);border:1px solid var(--border);border-radius:999px;letter-spacing:.04em}
  .meta-row strong{color:var(--text);font-weight:700}
  .hero-sub{color:var(--muted);font-size:clamp(15px,1.8vw,17px);max-width:760px;margin:0 auto 32px;line-height:1.65}.hero-sub strong{color:var(--text)}
  .hero-ctas{display:flex;gap:14px;justify-content:center;flex-wrap:wrap}
  .price-note{margin-top:22px;color:var(--muted);font-size:13px}.price-note strong{color:var(--text)}
  .stats-row{display:flex;justify-content:center;gap:48px;margin-top:40px;flex-wrap:wrap}.stat{text-align:center}.stat-num{font-size:24px;font-weight:800;color:var(--accent);line-height:1;font-family:monospace}.stat-lbl{font-size:10px;color:var(--muted);letter-spacing:.12em;text-transform:uppercase;margin-top:6px;font-weight:600}
  section{padding:60px 0}section+section{border-top:1px solid var(--border)}
  .section-label{display:inline-block;padding:4px 12px;background:rgba(0,212,255,.08);border:1px solid rgba(0,212,255,.25);color:var(--accent);border-radius:999px;font-size:10px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;margin-bottom:14px}
  h2{font-size:clamp(22px,3.4vw,32px);font-weight:800;margin-bottom:18px;letter-spacing:-.015em;line-height:1.2}
  .section-intro{color:var(--muted);font-size:16px;margin-bottom:36px;max-width:720px;line-height:1.65}.section-intro strong{color:var(--text)}
  .cards{display:grid;grid-template-columns:repeat(2,1fr);gap:18px}@media(max-width:720px){.cards{grid-template-columns:1fr}}
  .card{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:22px;transition:all .2s}.card:hover{border-color:var(--accent)}.card h3{font-size:16px;font-weight:700;margin-bottom:8px;color:var(--text)}.card p{font-size:14px;color:var(--muted);line-height:1.6}
  .events-box{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:24px 28px;max-width:780px}
  .events-box h3{font-size:14px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--accent);margin-bottom:16px}
  .events-box ul{list-style:none;padding:0;margin:0}.events-box li{padding:10px 0;border-bottom:1px dashed rgba(255,255,255,.04);font-size:14.5px;color:var(--text);position:relative;padding-left:24px}.events-box li:last-child{border-bottom:none}.events-box li::before{content:'▸';color:var(--accent);position:absolute;left:0;font-weight:800}
  .workflow-box{background:rgba(0,212,255,.05);border:1px solid rgba(0,212,255,.2);border-radius:8px;padding:20px 24px;margin-top:24px;max-width:780px}
  .workflow-box h3{color:var(--accent);font-size:13px;letter-spacing:.08em;text-transform:uppercase;margin-bottom:10px}
  .workflow-box p{font-size:14.5px;color:var(--text);line-height:1.7;margin:0}.workflow-box em{color:var(--accent);font-style:normal;font-weight:600}
  .faq{display:grid;gap:12px}.faq-item{background:var(--card);border:1px solid var(--border);border-radius:8px;padding:20px 24px}.faq-item h3{font-size:15px;font-weight:700;margin-bottom:8px}.faq-item p{font-size:14px;color:var(--muted);line-height:1.7}
  .explore-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;margin-bottom:30px}.explore-link{background:var(--card);border:1px solid var(--border);border-radius:8px;padding:14px 18px;color:var(--text);font-size:13px;font-weight:500;display:flex;align-items:center;gap:8px;transition:all .2s}.explore-link:hover{border-color:var(--accent);color:var(--accent);text-decoration:none}.explore-link .arrow{color:var(--accent)}
  .live-news{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:0;margin-top:18px;max-width:880px;overflow:hidden}
  .live-news .lnh{display:flex;align-items:center;justify-content:space-between;padding:16px 22px;border-bottom:1px solid var(--border);background:rgba(0,212,255,.04);flex-wrap:wrap;gap:12px}
  .live-news .lnh-title{display:flex;align-items:center;gap:10px;font-size:13px;color:var(--text);font-weight:700;letter-spacing:.04em}
  .live-news .lnh-dot{width:8px;height:8px;background:#10b981;border-radius:50%;animation:tnt-pulse 2s ease-in-out infinite;box-shadow:0 0 8px rgba(16,185,129,.6)}
  .live-news .lnh-meta{font-size:11px;color:var(--text-muted);letter-spacing:.04em;font-family:monospace}
  .live-news .lnh-meta span{color:var(--accent)}
  .live-news-list{padding:6px 22px}
  .live-news-row{display:grid;grid-template-columns:62px 1fr 70px;gap:12px;align-items:start;padding:14px 0;border-bottom:1px dashed rgba(255,255,255,.05)}
  .live-news-row:last-child{border-bottom:none}
  .lnr-time{color:var(--accent);font-family:monospace;font-size:11px;font-weight:700;padding-top:2px}
  .lnr-head{color:var(--text);font-size:14px;line-height:1.5}
  .lnr-impact{text-align:right;font-size:9px;letter-spacing:.1em;font-weight:700;padding-top:3px}
  .lnr-impact.HIGH{color:#ef4444}.lnr-impact.MEDIUM{color:#f59e0b}.lnr-impact.LOW{color:var(--text-muted)}
  .live-news-cta{padding:14px 22px;border-top:1px solid var(--border);text-align:center;font-size:13px}
  .live-news-cta a{color:var(--accent);font-weight:700;text-decoration:none}
  .live-news-cta a:hover{text-decoration:underline}
  .live-news-state{padding:28px 22px;text-align:center;color:var(--muted);font-size:14px}
  @media(max-width:720px){.live-news-row{grid-template-columns:50px 1fr 56px;gap:8px}.lnr-head{font-size:13px}}
  .ticker-cloud{display:flex;flex-wrap:wrap;gap:8px}
  .ticker-chip{background:var(--card);border:1px solid var(--border);border-radius:999px;padding:7px 14px;font-size:12px;color:var(--text);display:inline-flex;align-items:center;gap:6px;transition:all .15s}
  .ticker-chip:hover{border-color:var(--accent);color:var(--accent);text-decoration:none;transform:translateY(-1px)}
  .ticker-chip strong{font-family:monospace;font-weight:800;color:var(--accent)}.ticker-chip:hover strong{color:var(--accent)}
  .ticker-chip span{color:var(--muted);font-size:11px}
  .footer-cta{padding:72px 0;text-align:center;border-bottom:1px solid var(--border);background:linear-gradient(180deg,var(--bg) 0%,rgba(0,212,255,.04) 100%)}.footer-cta h2{margin-bottom:14px}.footer-cta p{color:var(--muted);font-size:16px;margin-bottom:30px;max-width:580px;margin:0 auto 30px}
  footer{padding:28px 0;text-align:center;color:var(--text-muted);font-size:13px}footer a{color:var(--text-muted);margin:0 14px}footer a:hover{color:var(--accent)}.footer-links{display:flex;gap:18px;justify-content:center;flex-wrap:wrap;margin-top:10px}
  @media(max-width:720px){nav{padding:16px 18px}.hero{padding:48px 0 40px}.hero-ctas{flex-direction:column;align-items:center}.btn-lg{width:100%;max-width:320px}section{padding:50px 0}}
</style>
</head>
<body>

<nav>
  <a href="/" class="nav-logo"><div class="nav-logo-icon"></div><div><div class="nav-logo-text">Trading <span>News</span> Terminal</div><div class="nav-logo-sub">${navSub}</div></div></a>
  <a href="https://app.tradingnewsterminal.com/?utm_source=seo&utm_campaign=ticker_${symbol}${utmLang}" class="btn btn-primary">${c.cta_top}</a>
</nav>

<section class="hero">
  <div class="container">
    <div class="topic-badge">${flag} ${region} · ${esc(exchange)} · ${esc(sector)}</div>
    <div class="ticker-h">${symbol}</div>
    <div class="name-sub">${esc(name)}</div>
    <h1>${esc(t.headline)}</h1>
    <div class="meta-row">
      <span><strong>Exchange:</strong> ${esc(exchange)}</span>
      <span><strong>Sector:</strong> ${esc(sector)}</span>
      <span><strong>Region:</strong> ${flag} ${region}</span>
    </div>
    <p class="hero-sub">${esc(intro)}</p>
    <div class="hero-ctas">
      <a href="https://app.tradingnewsterminal.com/?utm_source=seo&utm_campaign=ticker_${symbol}&utm_content=hero${utmLang}" class="btn btn-primary btn-lg">${c.cta_hero}</a>
      <a href="#drivers" class="btn btn-outline btn-lg">${c.cta_demo}</a>
    </div>
    <p class="price-note">${c.price_note}</p>
    <div class="stats-row">
      ${c.stats.map(([n, l]) => `<div class="stat"><div class="stat-num">${n}</div><div class="stat-lbl">${esc(l)}</div></div>`).join('\n      ')}
    </div>
  </div>
</section>

<section id="live-news">
  <div class="container">
    <div class="section-label">${c.sec_live_label}</div>
    <h2>${c.sec_live_title(symbol)}</h2>
    <p class="section-intro">${c.sec_live_intro(symbol)}</p>
    <div class="live-news" id="liveNewsBox">
      <div class="lnh">
        <div class="lnh-title"><span class="lnh-dot"></span>${symbol} · ${c.sec_live_label}</div>
        <div class="lnh-meta" id="lnhMeta">—</div>
      </div>
      <div id="liveNewsBody"><div class="live-news-state">${c.sec_live_loading}</div></div>
      <div class="live-news-cta"><a href="https://app.tradingnewsterminal.com/?utm_source=seo&utm_campaign=ticker_${symbol}&utm_content=livenews${utmLang}" target="_blank" rel="noopener">${c.sec_live_cta}</a></div>
    </div>
  </div>
</section>

<section id="drivers">
  <div class="container">
    <div class="section-label">${c.sec_drivers_label}</div>
    <h2>${c.sec_drivers_title(symbol, name)}</h2>
    <p class="section-intro">${c.sec_drivers_intro}</p>
    <div class="cards">
      ${driverCards}
    </div>
  </div>
</section>

<section>
  <div class="container">
    <div class="section-label">${c.sec_guide_label}</div>
    <h2>${c.sec_guide_title(symbol)}</h2>
    <p class="section-intro">${esc(t.guide_intro)}</p>
    <div class="events-box">
      <h3>${c.sec_events_h}</h3>
      <p style="color:var(--muted);font-size:14px;margin-bottom:14px">${c.sec_events_intro}</p>
      <ul>
        ${eventList}
      </ul>
    </div>
    <div class="workflow-box">
      <h3>${c.sec_workflow_h}</h3>
      <p>${c.sec_workflow_p(symbol)}</p>
    </div>
  </div>
</section>

<section>
  <div class="container">
    <div class="section-label">${c.sec_faq_label}</div>
    <h2>${c.sec_faq_h}</h2>
    <div class="faq">
      ${faqList}
    </div>
  </div>
</section>

<section>
  <div class="container">
    <div class="section-label">${c.sec_related_label}</div>
    <h2>${c.sec_related_h}</h2>
    <div class="explore-grid">
      ${relatedSeo}
    </div>
    <h3 style="font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:var(--text-muted);margin-bottom:14px;font-weight:700">Other tickers</h3>
    <div class="ticker-cloud">
      ${cloudLinks}
    </div>
  </div>
</section>

<section class="footer-cta">
  <div class="container">
    <h2>${c.footer_cta_h(symbol)}</h2>
    <p>${c.footer_cta_p(symbol)}</p>
    <div class="hero-ctas">
      <a href="https://app.tradingnewsterminal.com/?utm_source=seo&utm_campaign=ticker_${symbol}&utm_content=footer${utmLang}" class="btn btn-primary btn-lg">${c.cta_footer}</a>
    </div>
  </div>
</section>

<footer>
  <div class="container">
    <div>${c.footer_copy(symbol, name)}</div>
    <div class="footer-links">
      <a href="/">${c.footer_links[0]}</a><a href="/br">${c.footer_links[1]}</a><a href="/us">${c.footer_links[2]}</a><a href="/terms">${c.footer_links[3]}</a><a href="/privacy">${c.footer_links[4]}</a><a href="/faq">${c.footer_links[5]}</a>
    </div>
  </div>
</footer>

<script>
(function(){
  var SYMBOL = ${JSON.stringify(symbol)};
  var LANG = ${JSON.stringify(lang)};
  var REL = ${JSON.stringify(c.sec_live_relative)};
  var EMPTY = ${JSON.stringify(c.sec_live_empty(symbol))};
  var ERR = ${JSON.stringify(c.sec_live_error)};
  var API = "https://api.tradingnewsterminal.com/news?asset=" + encodeURIComponent(SYMBOL) + "&limit=10";
  var body = document.getElementById("liveNewsBody");
  var meta = document.getElementById("lnhMeta");
  function relTime(iso){
    if(!iso) return "";
    try{
      var t = new Date(iso.replace(" ", "T") + (iso.indexOf("Z") < 0 && iso.indexOf("+") < 0 ? "Z" : ""));
      var diff = (Date.now() - t.getTime()) / 1000;
      if(diff < 60) return REL.just_now;
      if(diff < 3600) return Math.floor(diff/60) + REL.m;
      if(diff < 86400) return Math.floor(diff/3600) + REL.h;
      return Math.floor(diff/86400) + REL.d;
    }catch(e){ return ""; }
  }
  function pickHeadline(it){
    var h;
    if(LANG === "pt-BR"){ h = it.headline_pt || it.headline_en; }
    else { h = it.headline_en || it.headline_pt; }
    return h || "";
  }
  function escapeHtml(s){
    return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  }
  function render(items){
    if(!items || !items.length){
      body.innerHTML = '<div class="live-news-state">' + escapeHtml(EMPTY) + '</div>';
      meta.innerHTML = '<span>0</span> items';
      return;
    }
    var rows = items.slice(0, 10).map(function(it){
      var h = pickHeadline(it);
      if(!h) return "";
      var imp = (it.impact || "LOW").toUpperCase();
      var t = relTime(it.timestamp || it.ingested_at);
      return '<div class="live-news-row">' +
        '<div class="lnr-time">' + escapeHtml(t) + '</div>' +
        '<div class="lnr-head">' + escapeHtml(h) + '</div>' +
        '<div class="lnr-impact ' + imp + '">' + escapeHtml(imp) + '</div>' +
        '</div>';
    }).join("");
    body.innerHTML = '<div class="live-news-list">' + rows + '</div>';
    meta.innerHTML = '<span>' + items.length + '</span> · refreshed ' + new Date().toLocaleTimeString();
  }
  function load(){
    fetch(API, { cache: "no-store" })
      .then(function(r){ return r.ok ? r.json() : Promise.reject(r.status); })
      .then(function(data){ render(Array.isArray(data) ? data : []); })
      .catch(function(e){
        if(body.innerHTML.indexOf("live-news-list") === -1){
          body.innerHTML = '<div class="live-news-state">' + escapeHtml(ERR) + '</div>';
        }
      });
  }
  load();
  setInterval(load, 60000);
})();
</script>

</body>
</html>
`;
}

// Build pages
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const written = [];
for (const t of cfg.tickers) {
  const html = renderPage(t, cfg.tickers);
  const out = path.join(OUT_DIR, `${t.symbol}.html`);
  fs.writeFileSync(out, html);
  written.push(t.symbol);
}

// Also build /ticker/index.html as a directory page listing all tickers
const indexHtml = buildIndex(cfg.tickers);
fs.writeFileSync(path.join(OUT_DIR, 'index.html'), indexHtml);

console.log(`Generated ${written.length} ticker pages: ${written.join(', ')}`);
console.log(`Plus /ticker/ directory index`);

function buildIndex(tickers) {
  const brTickers = tickers.filter(t => t.region === 'BR');
  const usTickers = tickers.filter(t => t.region === 'US');
  const cards = (group) => group.map(t => `<a href="/ticker/${t.symbol}" class="ticker-card"><div class="tc-sym">${t.symbol}</div><div class="tc-name">${esc(t.name)}</div><div class="tc-meta">${esc(t.sector)} · ${esc(t.exchange)}</div></a>`).join('\n      ');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Ticker Pages — Live News & AI Earnings Summary for Top US + BR Stocks</title>
<meta name="description" content="Live news feed and AI earnings summaries for top US and Brazilian tickers — PETR4, VALE3, ITUB4, AAPL, NVDA, TSLA, MSFT and more. Filter news by ticker with one click.">
<link rel="canonical" href="https://www.tradingnewsterminal.com/ticker">
<meta name="robots" content="index, follow">
<link rel="icon" href="/favicon.ico">
<meta property="og:type" content="website">
<meta property="og:url" content="https://www.tradingnewsterminal.com/ticker">
<meta property="og:title" content="Ticker Pages — Live News & AI Earnings Summary">
<meta property="og:image" content="https://www.tradingnewsterminal.com/og-image.png">
<style>
  :root{--bg:#0a0c0f;--card:#0f1218;--border:#1a2230;--text:#e2e8f0;--text-muted:#6b7d92;--muted:#8899aa;--accent:#00d4ff}
  *{margin:0;padding:0;box-sizing:border-box}body{background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,"Inter","Segoe UI",Roboto,sans-serif;line-height:1.6}
  a{color:var(--accent);text-decoration:none}.container{max-width:1180px;margin:0 auto;padding:0 24px}
  nav{padding:18px 32px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:16px}
  .nav-logo{display:flex;align-items:center;gap:12px;color:var(--text)}.nav-logo-icon{width:32px;height:32px;border:1.5px solid var(--accent)}.nav-logo-icon::before{content:'';display:block;width:10px;height:10px;background:var(--accent);margin:9px}
  .nav-logo-text{font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase}.nav-logo-text span{color:var(--accent)}
  .btn{display:inline-block;padding:11px 22px;border-radius:6px;font-weight:700;font-size:13px;letter-spacing:.04em;background:var(--accent);color:#002030;text-transform:uppercase}
  .hero{padding:72px 0 48px;text-align:center}
  h1{font-size:clamp(34px,5vw,52px);font-weight:800;letter-spacing:-.025em;margin-bottom:18px}h1 span{color:var(--accent)}
  .hero p{color:var(--muted);font-size:17px;max-width:720px;margin:0 auto 28px}
  section{padding:48px 0;border-top:1px solid var(--border)}
  h2{font-size:24px;font-weight:800;margin-bottom:24px;display:flex;align-items:center;gap:12px}
  .ticker-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:14px}
  .ticker-card{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:18px;display:block;transition:all .15s}
  .ticker-card:hover{border-color:var(--accent);transform:translateY(-2px)}
  .tc-sym{font-family:monospace;font-weight:800;font-size:22px;color:var(--accent);line-height:1;margin-bottom:6px}
  .tc-name{color:var(--text);font-size:14px;font-weight:600;margin-bottom:4px}
  .tc-meta{color:var(--muted);font-size:11px;text-transform:uppercase;letter-spacing:.05em}
  footer{padding:28px 0;text-align:center;color:var(--text-muted);font-size:13px;border-top:1px solid var(--border)}
  footer a{color:var(--text-muted);margin:0 14px}
</style>
</head>
<body>
<nav>
  <a href="/" class="nav-logo"><div class="nav-logo-icon"></div><div class="nav-logo-text">Trading <span>News</span> Terminal</div></a>
  <a href="https://app.tradingnewsterminal.com/" class="btn">Open App →</a>
</nav>

<div class="hero container">
  <h1>Ticker <span>Pages</span></h1>
  <p>Live news feed, AI earnings summary, and key drivers for ${tickers.length}+ top US and Brazilian stocks. One click per ticker filters your news feed.</p>
</div>

<section>
  <div class="container">
    <h2>🇧🇷 Brasil — Top tickers do Ibovespa</h2>
    <div class="ticker-grid">
      ${cards(brTickers)}
    </div>
  </div>
</section>

<section>
  <div class="container">
    <h2>🇺🇸 United States — S&amp;P 500 leaders</h2>
    <div class="ticker-grid">
      ${cards(usTickers)}
    </div>
  </div>
</section>

<footer>
  <div class="container">
    <div>© Trading News Terminal — Ticker pages index</div>
    <div style="margin-top:10px"><a href="/">Main</a><a href="/br">🇧🇷 Brasil</a><a href="/us">🇺🇸 US</a></div>
  </div>
</footer>
</body>
</html>
`;
}
