// sukusuku-navi Service Worker
// Aggressive caching to reduce GitHub Pages requests and prevent rate limiting

const CACHE_VERSION = "sukusuku-v3";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const PAGE_CACHE = `${CACHE_VERSION}-pages`;

// ---------------------------------------------------------------------------
// Install: Pre-cache essential resources
// ---------------------------------------------------------------------------

self.addEventListener("install", (event) => {
  // Use the SW scope as the root URL (handles basePath for GitHub Pages)
  const root = self.registration.scope;
  event.waitUntil(caches.open(STATIC_CACHE).then((cache) => cache.add(root)));
  self.skipWaiting();
});

// ---------------------------------------------------------------------------
// Activate: Clean up old caches
// ---------------------------------------------------------------------------

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== STATIC_CACHE && key !== PAGE_CACHE)
            .map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});

// ---------------------------------------------------------------------------
// Fetch: Strategy varies by request type
// ---------------------------------------------------------------------------

function isStaticAsset(url) {
  return /\.(js|css|woff2?|ttf|otf|ico|svg|png|jpg|jpeg|webp|avif|json)(\?|$)/i.test(
    url.pathname,
  );
}

function isNavigationRequest(request) {
  return request.mode === "navigate";
}

function isApiOrAuth(url) {
  return (
    url.pathname.includes("/api/") ||
    url.pathname.includes("/auth/") ||
    url.hostname.includes("supabase")
  );
}

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET and cross-origin requests
  if (event.request.method !== "GET") return;
  if (url.origin !== self.location.origin) return;
  if (isApiOrAuth(url)) return;

  // Strategy 1: Static assets -> Stale-While-Revalidate
  // Return cached version immediately, update cache in background
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) =>
        cache.match(event.request).then((cached) => {
          const networkFetch = fetch(event.request)
            .then((response) => {
              if (response.ok) {
                cache.put(event.request, response.clone());
              }
              return response;
            })
            .catch(() => cached);

          return cached || networkFetch;
        }),
      ),
    );
    return;
  }

  // Strategy 2: Navigation (HTML pages) -> Network First with cache fallback
  if (isNavigationRequest(event.request)) {
    event.respondWith(
      caches.open(PAGE_CACHE).then((cache) =>
        fetch(event.request)
          .then((response) => {
            if (response.ok) {
              cache.put(event.request, response.clone());
            }
            return response;
          })
          .catch(() =>
            cache.match(event.request).then(
              (cached) =>
                cached ||
                cache.match(self.registration.scope) ||
                new Response(
                  "オフラインです。ネットワーク接続を確認してください。",
                  {
                    status: 503,
                    headers: { "Content-Type": "text/plain; charset=utf-8" },
                  },
                ),
            ),
          ),
      ),
    );
    return;
  }
});
