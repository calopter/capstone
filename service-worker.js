const hyperdb = require('hyperdb')
const rai = require('random-access-idb')

const db = hyperdb(rai('./my.db'), {valueEncoding: 'utf-8'})

console.log('hello from sw')

const dbGet = async (path, rejection) => {
  return new Promise((resolve, reject) => {
    db.get(path, (err, nodes) => {
      if (err) return reject(err)
      if (!nodes[0]) return reject(rejection)
      const response = new Response(nodes[0].value)
      resolve(response)
    })
  })
}

const dbSet = async (key, val) => {
  return new Promise((resolve, reject) => {
    db.put(key, val, err => {
      if (err) return reject(err)
      resolve(`stored to ${key}`)
    })
  })
}

dbSet('/hello', 'hello world from db')

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url)
  e.respondWith(
    caches.match(e.request).then(response => {
      if (response) return response
      return dbGet(url.pathname, e.request).then(r => r).catch(fetch)
    })
  )
})

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('trieWiki').then(cache => {
      return cache.addAll([
        '/',
        'index.html',
        'bundle.js',
        'tachyons.min.css',
        'manifest.webmanifest',
        'assets/fox-icon.png',
      ])
    })
  )
})
