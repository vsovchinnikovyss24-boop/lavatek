// Офлайн-работа: отдаём из кэша, в фоне подтягиваем свежую версию
var CACHE="ppu-lavatek-v7";
var FILES=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","apple-touch-icon.png","favicon.png"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(FILES)}));self.skipWaiting()});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}))}));self.clients.claim()});
self.addEventListener("fetch",function(e){
  if(e.request.method!=="GET")return;
  var url=new URL(e.request.url);
  if(url.origin!==location.origin)return;
  e.respondWith(caches.open(CACHE).then(function(c){
    return c.match(e.request).then(function(hit){
      var net=fetch(e.request).then(function(r){if(r&&r.ok)c.put(e.request,r.clone());return r}).catch(function(){return hit});
      return hit||net;
    });
  }));
});
