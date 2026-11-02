const C="campo-1793582061";
const FILES=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
const VC="campo-vendor";
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C&&k!==VC).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  if(/\/(ocr-[^\/]+|tesseract-core[^\/]*|spa\.traineddata\.gz)$/.test(new URL(e.request.url).pathname)){
    e.respondWith(caches.open(VC).then(c=>c.match(e.request).then(r=>r||fetch(e.request).then(res=>{if(res&&res.ok)c.put(e.request,res.clone());return res;}))));
    return;
  }
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>{
    const net=fetch(e.request).then(res=>{ if(res&&res.ok&&new URL(e.request.url).origin===location.origin){const cp=res.clone();caches.open(C).then(c=>c.put(e.request,cp));} return res; }).catch(()=>null);
    return r||net.then(x=>x||caches.match("index.html"));
  }));
});
