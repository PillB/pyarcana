/*
 * PyArcana chunk-load guard.
 *
 * Loaded via next/script strategy="beforeInteractive" in layout.tsx, so it
 * runs BEFORE the Next.js bundle. Catches ChunkLoadError at the window level
 * (both 'error' and 'unhandledrejection' events) during initial hydration —
 * before React's global-error.tsx boundary has mounted.
 *
 * Strategy: 30-second cooldown via sessionStorage. More lenient than a
 * single-shot flag because GitHub Pages CDN may still be serving stale HTML
 * on the first reload; the cooldown lets us retry once more after 30s.
 * Hard stop after MAX_RELOADS to avoid infinite loops.
 */
(function () {
  if (typeof window === 'undefined') return;
  try {
    var PATTERNS = [
      'ChunkLoadError',
      'Loading chunk',
      'Loading CSS chunk',
      'Failed to fetch dynamically imported module',
      'module factory is not available'
    ];
    var KEY = 'pyarcana-chunk-guard-last-reload';
    var COUNT_KEY = 'pyarcana-chunk-guard-reload-count';
    var COOLDOWN_MS = 30000; // 30 seconds
    var MAX_RELOADS = 3;     // hard stop after 3 reloads in one session

    function matches(m) {
      if (!m) return false;
      m = String(m);
      for (var i = 0; i < PATTERNS.length; i++) {
        if (m.indexOf(PATTERNS[i]) !== -1) return true;
      }
      return false;
    }

    function tryReload() {
      try {
        var count = Number(window.sessionStorage.getItem(COUNT_KEY) || 0);
        if (count >= MAX_RELOADS) return; // give up — let global-error.tsx show the fallback UI
        var last = Number(window.sessionStorage.getItem(KEY) || 0);
        if (Date.now() - last < COOLDOWN_MS) return;
        window.sessionStorage.setItem(KEY, String(Date.now()));
        window.sessionStorage.setItem(COUNT_KEY, String(count + 1));
      } catch (e) {
        /* sessionStorage may be unavailable in private mode — proceed without guard */
      }
      // Hard reload (bypass bfcache) to fetch fresh HTML with current chunk hashes.
      window.location.reload();
    }

    // Capture phase so we see the error before React's error boundary.
    window.addEventListener('error', function (e) {
      var m = (e.error && e.error.message) || e.message;
      if (matches(m)) {
        e.preventDefault();
        tryReload();
      }
    }, true);

    window.addEventListener('unhandledrejection', function (e) {
      var r = e.reason;
      var m = (r && r.message) || r;
      if (matches(m)) {
        e.preventDefault();
        tryReload();
      }
    });
  } catch (e) {
    /* never let the guard itself break the page */
  }
})();
