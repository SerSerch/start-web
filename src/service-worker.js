let doCache=!0;const CACHE_NAME="my-pwa-cache-v2";self.addEventListener("activate",e=>{const g=[CACHE_NAME];e.waitUntil(caches.keys().then(e=>Promise.all(e.map(e=>{if(!g.includes(e))return caches.delete(e)}))))}),self.addEventListener("install",function(e){doCache&&e.waitUntil(caches.open(CACHE_NAME).then(function(e){e.addAll(["/","/bundle.js","/main.css","/svg/logo.svg","/img/imgslide1.jpg","/img/imgslide2.jpg","/img/imgtextures1.jpg","/img/imgtextures2.jpg","/img/imgtextures3.jpg","/img/imgtextures4.jpg","/img/imgtextures5.jpg","/img/imgclose.png","/img/2yr0.jpg","/img/bezsh0.jpg","/img/contr0.jpg","/img/double0.jpg","/img/line0.jpg","/img/par0.jpg","/img/photo0.jpg","/img/pk50.jpg","/img/polu0.jpg","/img/ppoz0.jpg","/img/ten0.jpg","/img/tkan0.jpg"])}))}),self.addEventListener("fetch",function(e){doCache&&e.respondWith(caches.match(e.request).then(function(g){return g||fetch(e.request)}))});