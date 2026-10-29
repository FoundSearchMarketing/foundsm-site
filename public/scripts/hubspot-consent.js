/*
  Loads HubSpot site tracking only after the visitor has made a OneTrust
  choice and both cookie groups that this script writes are allowed.

  OneTrust on foundsm.com classifies the cookies this script sets as:
    C0002 Performance: __hstc, __hssc, __hssrc
    C0003 Functional:  hubspotutk
  Targeting (C0004) does not include these cookies.

  The US template is opt-out, so OneTrust can mark C0002 active before anyone
  clicks. This waits for an explicit banner or preference-center choice
  (OptanonAlertBoxClosed, or OptanonConsent interactionCount > 0) so the
  cookies are not set while the banner is still unanswered.
*/
(function () {
  var GROUPS = ['C0002', 'C0003'];
  var COOKIES = ['__hstc', 'hubspotutk', '__hssrc', '__hssc'];
  var loaded = false;

  function readCookie(name) {
    var match = document.cookie.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
    if (!match) return '';
    try {
      return decodeURIComponent(match[1]);
    } catch (error) {
      return match[1];
    }
  }

  function decodeGroups(value) {
    var text = value || '';
    try {
      text = decodeURIComponent(text);
    } catch (error) {
      /* already decoded */
    }
    return text;
  }

  function allowedFromActiveGroups() {
    var active = window.OnetrustActiveGroups;
    if (typeof active !== 'string' || !active) return null;
    return active.split(',').filter(Boolean);
  }

  function allowedFromConsentCookie() {
    var consent = readCookie('OptanonConsent');
    if (!consent) return null;
    var match = consent.match(/(?:^|&)groups=([^&]*)/);
    if (!match) return null;
    var allowed = [];
    decodeGroups(match[1]).split(',').forEach(function (part) {
      var bits = part.split(':');
      if (bits.length === 2 && bits[1] === '1' && bits[0]) allowed.push(bits[0]);
    });
    return allowed;
  }

  function hasInteracted() {
    try {
      if (window.OneTrust && typeof window.OneTrust.IsAlertBoxClosed === 'function' && window.OneTrust.IsAlertBoxClosed()) {
        return true;
      }
    } catch (error) {
      /* OneTrust not ready */
    }
    if (readCookie('OptanonAlertBoxClosed')) return true;
    var consent = readCookie('OptanonConsent');
    var count = consent.match(/(?:^|&)interactionCount=([^&]*)/);
    if (!count) return false;
    var parsed = parseInt(decodeGroups(count[1]), 10);
    return parsed > 0;
  }

  function allowedGroups() {
    return allowedFromActiveGroups() || allowedFromConsentCookie() || [];
  }

  function hasConsent() {
    if (!hasInteracted()) return false;
    var allowed = allowedGroups();
    return GROUPS.every(function (id) { return allowed.indexOf(id) !== -1; });
  }

  function consentKnown() {
    return allowedFromActiveGroups() !== null || allowedFromConsentCookie() !== null || hasInteracted();
  }

  function clearHubSpotCookies() {
    var host = window.location.hostname;
    var root = host.replace(/^www\./, '');
    var domains = ['', host, root, '.' + root];
    COOKIES.forEach(function (name) {
      domains.forEach(function (domain) {
        document.cookie = name + '=; Max-Age=0; path=/' + (domain ? '; domain=' + domain : '');
      });
    });
  }

  function loadHubSpot() {
    if (loaded || document.getElementById('hs-script-loader')) {
      loaded = true;
      return;
    }
    loaded = true;
    var script = document.createElement('script');
    script.id = 'hs-script-loader';
    script.async = true;
    script.src = 'https://js.hs-scripts.com/5045186.js';
    (document.head || document.documentElement).appendChild(script);
  }

  function onConsent() {
    if (hasConsent()) {
      loadHubSpot();
      return;
    }
    if (consentKnown()) clearHubSpotCookies();
  }

  var previousWrapper = window.OptanonWrapper;
  window.OptanonWrapper = function () {
    if (typeof previousWrapper === 'function') {
      try { previousWrapper(); } catch (error) { /* keep going */ }
    }
    onConsent();
    setTimeout(onConsent, 0);
  };

  window.addEventListener('OneTrustGroupsUpdated', function () {
    onConsent();
    setTimeout(onConsent, 0);
  });

  function bindConsentChanged() {
    if (!window.OneTrust || typeof window.OneTrust.OnConsentChanged !== 'function') return false;
    if (window.OneTrust.__foundsmHubspotBound) return true;
    window.OneTrust.__foundsmHubspotBound = true;
    window.OneTrust.OnConsentChanged(function () {
      onConsent();
      setTimeout(onConsent, 0);
    });
    return true;
  }

  if (!bindConsentChanged()) {
    var tries = 0;
    var timer = window.setInterval(function () {
      tries += 1;
      if (bindConsentChanged() || tries > 40) window.clearInterval(timer);
    }, 250);
  }

  onConsent();
})();
