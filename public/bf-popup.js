/* TNT Black Friday popup — EN only, campaign-driven, self-removing.
 * Shows a small dismissible card linking to the 1-click annual checkout (€250).
 * Driven by GET /campaign/annual-offer: when the campaign ends (coupon expires)
 * the endpoint returns active:false and NOTHING shows — no date hardcoded, no
 * manual revert. Only renders on English pages (html lang^="en"); auth/admin
 * pages are skipped. (Luís 25-nov, Black Friday) */
(function () {
  'use strict';
  try {
    var lang = (document.documentElement.getAttribute('lang') || 'en').toLowerCase();
    if (lang.slice(0, 2) !== 'en') return;               // EN pages only
    var path = (location.pathname || '').toLowerCase();
    var SKIP = ['/login', '/signin', '/signup', '/reset-password', '/verify-email', '/admin', '/404'];
    for (var i = 0; i < SKIP.length; i++) { if (path.indexOf(SKIP[i]) === 0) return; }
    if (localStorage.getItem('tnt_bf_popup_dismissed_v1') === '1') return;
  } catch (_) { /* keep going if storage/lang read throws */ }

  var API = 'https://api.tradingnewsterminal.com/campaign/annual-offer';
  var CTA_URL = 'https://www.tradingnewsterminal.com/login?checkout=annual';

  function dismiss() {
    try { localStorage.setItem('tnt_bf_popup_dismissed_v1', '1'); } catch (_) {}
    var el = document.getElementById('tntBfPopup');
    if (el) { el.classList.remove('tntbf-in'); setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 320); }
  }

  function fmtDeadline(ts) {
    if (!ts) return '';
    try { return new Date(ts * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); } catch (_) { return ''; }
  }

  function show(d) {
    var cur = (d.currency === 'EUR') ? '€' : ((d.currency || 'EUR') + ' ');
    var price = cur + Math.round(d.annual_price);
    var save = cur + Math.round(d.save);
    var until = fmtDeadline(d.deadline);
    var label = (d.label || 'Black Friday');

    var css = document.createElement('style');
    css.textContent =
      '#tntBfPopup{position:fixed;right:20px;bottom:20px;z-index:2147483000;width:340px;max-width:calc(100vw - 32px);' +
      'background:#0f1521;border:1px solid #243244;border-radius:14px;padding:18px 18px 16px;' +
      'box-shadow:0 18px 50px rgba(0,0,0,.55);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;' +
      'opacity:0;transform:translateY(16px);transition:opacity .32s ease,transform .32s ease;}' +
      '#tntBfPopup.tntbf-in{opacity:1;transform:translateY(0);}' +
      '#tntBfPopup .tntbf-badge{display:inline-block;background:#00d4ff;color:#04121a;font-weight:800;font-size:10.5px;' +
      'letter-spacing:.6px;padding:3px 9px;border-radius:5px;text-transform:uppercase;}' +
      '#tntBfPopup .tntbf-h{color:#f0f9ff;font-size:18px;font-weight:800;margin:11px 0 5px;line-height:1.25;letter-spacing:-.01em;}' +
      '#tntBfPopup .tntbf-h b{color:#00d4ff;}' +
      '#tntBfPopup .tntbf-p{color:#9fb3c8;font-size:13px;line-height:1.5;margin:0 0 14px;}' +
      '#tntBfPopup .tntbf-cta{display:block;text-align:center;background:#00d4ff;color:#04121a;text-decoration:none;' +
      'border-radius:8px;padding:12px;font-weight:800;font-size:14px;letter-spacing:.2px;}' +
      '#tntBfPopup .tntbf-cta:hover{background:#2ee0ff;}' +
      '#tntBfPopup .tntbf-x{position:absolute;top:10px;right:12px;background:transparent;border:0;color:#5b6b7e;' +
      'font-size:20px;line-height:1;cursor:pointer;padding:4px;}' +
      '#tntBfPopup .tntbf-x:hover{color:#9fb3c8;}' +
      '#tntBfPopup .tntbf-sub{color:#64748b;font-size:11px;margin-top:9px;text-align:center;}' +
      '@media(max-width:520px){#tntBfPopup{right:12px;left:12px;bottom:12px;width:auto;}}';
    document.head.appendChild(css);

    var el = document.createElement('div');
    el.id = 'tntBfPopup';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', label + ' offer');
    el.innerHTML =
      '<button class="tntbf-x" id="tntBfX" aria-label="Close">×</button>' +
      '<span class="tntbf-badge">' + esc(label) + '</span>' +
      '<div class="tntbf-h">Pro Annual — <b>' + esc(price) + '</b>/yr</div>' +
      '<p class="tntbf-p">A full year of real-time market news. Save ' + esc(save) +
      (until ? ' · ends ' + esc(until) : '') + '.</p>' +
      '<a class="tntbf-cta" href="' + CTA_URL + '">Get the ' + esc(label) + ' deal →</a>' +
      '<div class="tntbf-sub">1-click · no code needed</div>';
    document.body.appendChild(el);
    document.getElementById('tntBfX').onclick = dismiss;
    requestAnimationFrame(function () { el.classList.add('tntbf-in'); });
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }

  function init() {
    fetch(API, { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { if (d && d.active && d.save > 0 && d.annual_price != null) { setTimeout(function () { show(d); }, 1400); } })
      .catch(function () {});
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
