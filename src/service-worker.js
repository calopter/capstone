const { write, newForm, read, create } = require('./controller')

self.addEventListener('fetch', async e => {
  e.respondWith(
    write(e.request)
      .catch(newForm)
      .catch(read)
      .catch(create)
      // .catch(fetch)
  )
})

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('trieWiki').then(cache => {
      return cache.addAll([
        '/',
        'index.html',
        'src/index.js',
        'src/tachyons.min.css',
        'manifest.webmanifest',
        'assets/fox-icon.png',
      ])
    })
  )
})
