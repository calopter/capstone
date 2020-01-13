const route = require('./router')

self.addEventListener('fetch', route)

self.addEventListener('message', msg => {
  const file = msg.data
  
  caches.open('trieWiki').then(cache => {
    const req = new Request(file.name)
    const headers = { headers: {'content-type': file.type }}
    const resp = new Response(file, headers)
    cache.put(req, resp)
  })
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
