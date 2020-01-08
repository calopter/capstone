const hyperdb = require('hyperdb')
const rai = require('random-access-idb')

const db = hyperdb(rai('./my.db'), {valueEncoding: 'utf-8'})

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

const cachedResponse = ({ request }) => {
  const url = new URL(request.url)
  
  return caches.match(request).then(response => {
    if (response) return response
    return dbGet(url.pathname, request).catch(fetch)
  })
}

const postResponse = e => new Promise(resolve => {
  e.request.formData().then(data => {
    const title = data.get('title')
    const body = data.get('body')
    dbSet(title, body)
    return resolve(new Response(body))
  })
})

self.addEventListener('fetch', e => {
  e.respondWith(e.request.method === 'POST' ?
    postResponse(e) : cachedResponse(e)
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
