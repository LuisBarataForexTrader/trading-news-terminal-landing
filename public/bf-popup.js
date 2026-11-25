/* TNT Black Friday popup — shows the English BF creative as a modal.
 * Campaign-driven: fetches GET /campaign/annual-offer and only shows while the
 * campaign is active (coupon not expired). When it ends (6 Dec) the endpoint
 * returns active:false and NOTHING shows — no date hardcoded, no manual revert.
 * EN pages only (html lang^="en"); auth/admin pages skipped; dismissible. The
 * creative image itself links to the 1-click annual checkout (€250). (Luís 25-nov) */
(function () {
  'use strict';
  var DISMISS_KEY = 'tnt_bf_popup_v2_dismissed';
  try {
    var lang = (document.documentElement.getAttribute('lang') || 'en').toLowerCase();
    if (lang.slice(0, 2) !== 'en') return;                 // EN pages only
    var path = (location.pathname || '').toLowerCase();
    var SKIP = ['/login', '/signin', '/signup', '/reset-password', '/verify-email', '/admin', '/404'];
    for (var i = 0; i < SKIP.length; i++) { if (path.indexOf(SKIP[i]) === 0) return; }
    if (localStorage.getItem(DISMISS_KEY) === '1') return;
  } catch (_) { /* keep going if storage/lang read throws */ }

  var API = 'https://api.tradingnewsterminal.com/campaign/annual-offer';
  var CTA_URL = 'https://www.tradingnewsterminal.com/login?checkout=annual';
  var IMG = '/campaign/bf-en.jpg';

  function dismiss() {
    try { localStorage.setItem(DISMISS_KEY, '1'); } catch (_) {}
    var el = document.getElementById('tntBfPopup');
    if (el) { el.classList.remove('tntbf-in'); setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 300); }
  }

  function show() {
    var css = document.createElement('style');
    css.textContent =
      '#tntBfPopup{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;' +
      'padding:20px;background:rgba(3,7,18,.82);opacity:0;transition:opacity .3s ease;}' +
      '#tntBfPopup.tntbf-in{opacity:1;}' +
      '#tntBfPopup .tntbf-card{position:relative;transform:translateY(14px) scale(.98);transition:transform .3s ease;}' +
      '#tntBfPopup.tntbf-in .tntbf-card{transform:translateY(0) scale(1);}' +
      '#tntBfPopup .tntbf-img{display:block;width:auto;max-width:min(440px,92vw);max-height:84vh;' +
      'border-radius:14px;box-shadow:0 24px 70px rgba(0,0,0,.6);cursor:pointer;}' +
      '#tntBfPopup .tntbf-cta{display:block;text-align:center;margin:12px auto 0;max-width:min(440px,92vw);' +
      'background:#00d4ff;color:#04121a;text-decoration:none;border-radius:9px;padding:13px;font-weight:800;' +
      'font-size:15px;letter-spacing:.2px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;}' +
      '#tntBfPopup .tntbf-cta:hover{background:#2ee0ff;}' +
      '#tntBfPopup .tntbf-x{position:absolute;top:-14px;right:-14px;width:34px;height:34px;border-radius:50%;' +
      'background:#0f1521;border:1px solid #2b3a4d;color:#cbd5e1;font-size:20px;line-height:1;cursor:pointer;' +
      'display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(0,0,0,.5);}' +
      '#tntBfPopup .tntbf-x:hover{background:#1a2535;color:#fff;}' +
      '@media(max-width:520px){#tntBfPopup .tntbf-x{top:-10px;right:-6px;}}';
    document.head.appendChild(css);

    var el = document.createElement('div');
    el.id = 'tntBfPopup';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'Black Friday offer');
    el.innerHTML =
      '<div class="tntbf-card">' +
      '<button class="tntbf-x" id="tntBfX" aria-label="Close">×</button>' +
      '<a href="' + CTA_URL + '" aria-label="Get the Black Friday deal">' +
      '<img class="tntbf-img" src="' + IMG + '" alt="Trading News Terminal — Black Friday: Pro Annual deal" loading="eager">' +
      '</a>' +
      '<a class="tntbf-cta" href="' + CTA_URL + '">Get the Black Friday deal →</a>' +
      '</div>';
    document.body.appendChild(el);

    document.getElementById('tntBfX').onclick = dismiss;
    el.addEventListener('click', function (e) { if (e.target === el) dismiss(); }); // click backdrop closes
    requestAnimationFrame(function () { el.classList.add('tntbf-in'); });
  }

  function init() {
    fetch(API, { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { if (d && d.active) { setTimeout(show, 1400); } })
      .catch(function () {});
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
