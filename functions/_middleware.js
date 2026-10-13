// Cloudflare Pages middleware for the TNT landing.
// 1) apex (tradingnewsterminal.com) -> www 301.
// 2) Transparent proxy of the SEO/content paths to the backend (api.tradingnewsterminal.com):
//    /blog, /news, per-language /news, /pt SEO pages, sitemaps-news, /og, /affiliates/verify,
//    google site-verification files. Everything else is served statically (next()).
const BACKEND = "https://api.tradingnewsterminal.com";
const LANGS = ["pt", "es", "fr", "de", "ar"];

function isProxied(p) {
  if (p === "/news" || p.startsWith("/news/")) return true;
  if (p === "/blog" || p.startsWith("/blog/")) return true;
  if (p.startsWith("/og/")) return true;
  if (/^\/sitemap-news(-[a-z]{2})?\.xml$/.test(p)) return true;
  if (p === "/affiliates/verify") return true;
  for (const l of LANGS) {
    if (p === "/" + l + "/news" || p.startsWith("/" + l + "/news/")) return true;
  }
  // pt SEO landing pages served by the backend
  if (p.startsWith("/pt/") && /(noticias|mercados|economia|sitemap\.xml)/.test(p)) return true;
  // google site-verification (optionally language-prefixed, optionally under /news)
  if (/^\/(?:(?:pt|es|fr|de|ar)\/)?(?:news\/)?google[\w-]{7,63}(?:\.html)?$/.test(p)) return true;
  return false;
}

export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);

  // apex -> www
  if (url.hostname === "tradingnewsterminal.com") {
    url.hostname = "www.tradingnewsterminal.com";
    return Response.redirect(url.toString(), 301);
  }

  // transparent proxy to backend for content/SEO paths
  if (isProxied(url.pathname)) {
    const target = BACKEND + url.pathname + url.search;
    const proxied = new Request(target, request);
    proxied.headers.set("X-Forwarded-Host", url.hostname);
    return fetch(proxied);
  }

  return next();
}
