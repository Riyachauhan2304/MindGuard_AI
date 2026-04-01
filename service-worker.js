const CACHE_NAME = "mindguard-v1";

self.addEventListener("install", function(event){
    console.log("SW Installed");

    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache){
            return cache.addAll([
                "/",
                "/index.html",

                // public pages
                "/public/login.html",
                "/public/register.html",
                "/public/dashboard.html",
                "/public/features.html",
                "/public/about.html",

                // css + js
                "/public/assets/css/main.css",
                "/public/assets/js/lazy-load.js",

                // images (important ones)
                "/public/assets/images/logo.webp"
            ]);
        })
    );
});

// fetch
self.addEventListener("fetch", function(event){
    event.respondWith(
        caches.match(event.request).then(function(response){
            return response || fetch(event.request);
        })
    );
});