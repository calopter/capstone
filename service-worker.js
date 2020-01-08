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
      resolve(val)
    })
  })
}

dbSet('/hello', 'hello world from db')

const cached = async request => {
  const url = new URL(request.url)
  
  return caches.match(request).then(response => {
    if (response) return response
    return dbGet(url.pathname, request)
  })
}

const posted = async request => {
  return new Promise((resolve, reject) => {
    if (request.method === 'POST') {
      return request.formData().then(data => {
        const title = data.get('title')
        const body = data.get('body')
        
        return dbSet(title, body)
      }).then(body => resolve(new Response(body)))
    }
    return reject(request)
  })
}

self.addEventListener('fetch', e => {
  e.respondWith(posted(e.request).catch(cached).catch(fetch))
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
