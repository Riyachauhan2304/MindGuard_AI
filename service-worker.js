const CACHE_NAME = "mindguard-v1";

self.addEventListener("install", function(event){
    console.log("SW Installed");

    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache){
            return cache.addAll([
                "/MindGuard_AI/",
                "/MindGuard_AI/index.html",

                // public pages
                "/MindGuard_AI/public/login.html",
                "/MindGuard_AI/public/register.html",
                "/MindGuard_AI/public/dashboard.html",
                "/MindGuard_AI/public/features.html",
                "/MindGuard_AI/public/about.html",

                // css + js
                "/MindGuard_AI/public/assets/css/main.css",
                "/MindGuard_AI/public/assets/js/lazy-load.js",

                // images
                "/MindGuard_AI/public/assets/images/logo.webp"
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
