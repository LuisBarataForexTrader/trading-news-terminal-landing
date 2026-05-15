/* Trading News Terminal — Embeddable Widget v1.0
 * https://tradingnewsterminal.com/widget.js
 * Usage: <script src="https://tradingnewsterminal.com/widget.js" data-key="KEY" data-theme="dark" data-topics="forex,commodities" data-impact="high,medium"></script>
 */
(function () {
  'use strict';

  var BASE_URL = 'https://tradingnewsterminal.com/widget-preview.html';
  var DEFAULT_HEIGHT = 480;

  function buildUrl(opts) {
    var p = [];
    if (opts.theme && opts.theme !== 'dark') p.push('theme=' + encodeURIComponent(opts.theme));
    if (opts.topics) p.push('topics=' + encodeURIComponent(Array.isArray(opts.topics) ? opts.topics.join(',') : opts.topics));
    if (opts.impact && opts.impact !== 'all') p.push('impact=' + encodeURIComponent(Array.isArray(opts.impact) ? opts.impact.join(',') : opts.impact));
    if (opts.key) p.push('key=' + encodeURIComponent(opts.key));
    return BASE_URL + (p.length ? '?' + p.join('&') : '');
  }

  function injectFrame(container, opts) {
    if (typeof container === 'string') container = document.querySelector(container);
    if (!container) return null;

    var h = parseInt(opts.height, 10) || DEFAULT_HEIGHT;

    var wrapper = document.createElement('div');
    wrapper.style.cssText = 'position:relative;width:100%;height:' + h + 'px;overflow:hidden;border-radius:' + (opts.radius || '0') + ';';

    var iframe = document.createElement('iframe');
    iframe.src = buildUrl(opts);
    iframe.title = 'Trading News Terminal — Live Market News';
    iframe.setAttribute('loading', 'lazy');
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('frameborder', '0');
    iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:none;display:block;';

    wrapper.appendChild(iframe);
    container.innerHTML = '';
    container.appendChild(wrapper);
    return iframe;
  }

  /* ── Auto-init from <script> tag attributes ── */
  var _script = document.currentScript || (function () {
    var s = document.getElementsByTagName('script');
    return s[s.length - 1];
  })();

  if (_script && _script.getAttribute('data-key') !== null) {
    var _opts = {
      key:    _script.getAttribute('data-key')    || '',
      theme:  _script.getAttribute('data-theme')  || 'dark',
      topics: _script.getAttribute('data-topics') || '',
      impact: _script.getAttribute('data-impact') || 'all',
      height: _script.getAttribute('data-height') || DEFAULT_HEIGHT,
      radius: _script.getAttribute('data-radius') || '8px',
    };
    var _target = _script.getAttribute('data-target') || '#tnt-widget';

    /* Wait for DOM if needed */
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { injectFrame(_target, _opts); });
    } else {
      injectFrame(_target, _opts);
    }
  }

  /* ── JavaScript API ── */
  function TNTWidget(opts) {
    if (!(this instanceof TNTWidget)) return new TNTWidget(opts);
    this.opts   = opts || {};
    this.iframe = null;
  }

  TNTWidget.prototype.init = function () {
    var container = this.opts.container || '#tnt-widget';
    this.iframe = injectFrame(container, this.opts);
    return this;
  };

  TNTWidget.prototype.setTheme = function (theme) {
    this.opts.theme = theme;
    if (this.iframe) this.iframe.src = buildUrl(this.opts);
    return this;
  };

  TNTWidget.prototype.setTopics = function (topics) {
    this.opts.topics = topics;
    if (this.iframe) this.iframe.src = buildUrl(this.opts);
    return this;
  };

  TNTWidget.prototype.destroy = function () {
    if (this.iframe && this.iframe.parentNode) {
      this.iframe.parentNode.parentNode.innerHTML = '';
    }
    return this;
  };

  /* Expose globally */
  window.TNTWidget = TNTWidget;

})();
