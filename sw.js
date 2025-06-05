const cacheName = 'ais-cache-v1';
const files = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './audio.js',
  './ui.js',
  './game.html',
  './action_game.html',
  './manifest.json',
  './icon.png'
];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(cacheName).then(c=>c.addAll(files)));
});
self.addEventListener('fetch',e=>{
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
