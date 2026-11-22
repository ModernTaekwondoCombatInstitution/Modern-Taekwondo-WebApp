/* Modern Taekwondo: tiny service worker.
   Always asks the internet first, so a new version you upload shows up straight away.
   Only if the phone is offline does it use the last copy it saved. */
const CACHE = 'mt-shell-v1';
self.addEventListener('install', function(e){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function(e){
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(r).then(function(res){
      if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(function(c){ c.put(r, copy); }); }
      return res;
    }).catch(function(){ return caches.match(r).then(function(m){ return m || caches.match('./index.html'); }); })
  );
});
