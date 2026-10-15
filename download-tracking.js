/* Download-click-only GoatCounter integration.
 * Public endpoint, NOT a password or API key. No unique-visitor metric.
 */
(() => {
  'use strict';
  const ENDPOINT = 'https://crankhog.goatcounter.com/count';
  if (!/^https:\/\/[a-z0-9-]+\.goatcounter\.com\/count$/.test(ENDPOINT)) return;
  if (!['crankhog.app', 'www.crankhog.app'].includes(location.hostname)) return;
  if (navigator.globalPrivacyControl === true || navigator.doNotTrack === '1') return;

  // No automatic pageviews, query strings, referrers, or per-visitor browser IDs.
  window.goatcounter = { no_onload: true, no_events: true };
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://gc.zgo.at/count.js';
  script.setAttribute('data-goatcounter', ENDPOINT);
  script.onload = () => {
    // count.js includes location.search even for fixed-name events. Remove it
    // before transport, along with screen width, to avoid sending extra data.
    const getData = window.goatcounter.get_data;
    if (typeof getData !== 'function') return;
    window.goatcounter.get_data = (vars) => {
      const data = getData(vars);
      delete data.q;
      delete data.s;
      return data;
    };
  };
  document.head.appendChild(script);

  function track(event) {
    if (event.defaultPrevented) return;
    if (event.type === 'click' && event.button !== 0) return;
    if (event.type === 'auxclick' && event.button !== 1) return;
    const link = event.target.closest && event.target.closest('a[data-dmg]');
    if (!link) return;
    let url;
    try { url = new URL(link.href); } catch (_) { return; }
    // A click on the fallback releases page is not a DMG download attempt.
    if (url.origin !== 'https://github.com' ||
        !/^\/raytfitzgerald\/CrankHog\/releases\/download\/[^/]+\/[^/]+\.dmg$/i.test(url.pathname)) return;
    if (!window.goatcounter || typeof window.goatcounter.count !== 'function') return;
    const common = { event: true, referrer: '' };
    try {
      window.goatcounter.count({ ...common, path: 'mac-download-click-total',
        title: 'Mac download clicks (all)', no_session: true });
    } catch (_) {
      // Analytics must never stop or delay a download.
    }
  }
  document.addEventListener('click', track);
  document.addEventListener('auxclick', track);
})();
