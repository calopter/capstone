self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('capstone').then(cache => {
      return cache.addAll([
        '/',
        'index.html',
        'index.js',
      ])
    })
  )
})

self.addEventListener('fetch', e => {
  // console.log(e.request.url);
  e.respondWith(
    caches.match(e.request)
      .then(response => response || fetch(e.request))
  )
})
