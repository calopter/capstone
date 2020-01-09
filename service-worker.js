const hyperdb = require('hyperdb')
const rai = require('random-access-idb')

const db = hyperdb(rai('./my.db'), {valueEncoding: 'utf-8'})

const dbGet = (path, rejection) => {
  return new Promise((resolve, reject) => {
    db.get(path, (err, nodes) => {
      if (err) return reject(err)
      if (!nodes[0]) return reject(rejection)
      resolve(nodes[0].value)
    })
  })
}

const dbRead = path => {
  return new Promise(resolve => {
    db.get(path, (err, nodes) => {
      if (err) return resolve(null)
      if (!nodes[0]) return resolve(null)
      return resolve(nodes[0].value)
    })
  })
}

const dbSet = (key, val) => {
  return new Promise((resolve, reject) => {
    db.put(key, val, err => {
      if (err) return reject(err)
      resolve(val)
    })
  })
}

dbSet('/hello', "<a href='hello?edit=true'>hello world from db</a>")
dbSet('/index', "<a href='/new'>some new content</a>")
dbSet('/hi', 'hi')
dbSet('empty', null)

const respond = body => {
  const headers = { headers: { 'Content-Type': 'text/html' }}
  return new Response(body, headers)
}

const read = request => {
  const url = new URL(request.url)

  return new Promise((resolve, reject) => {
    return caches.match(request).then(response => {
      if (response) return resolve(response)
      return dbGet(url.pathname, request)
    }).then(content => resolve(respond(content))).catch(reject)
  })
}

const create = request => {
  return new Promise((resolve, reject) => {
    if (request.method === 'POST') {
      return request.formData().then(data => {
        const title = new URL(request.url).pathname
        const body = data.get('body')

        return dbSet(title, body)
      }).then(body => resolve(respond(body)))
    }
    return reject(request)
  })
}

const form = contents => {
  return `<form method="post">
     <label for="body">body:</label>
     <input class="db ma3"
       id="body" name="body"
       type="text-area"
       value=${contents}/>
     <input type="submit" value="submit"/>
  </form>`
}

const newForm = request => {
  const url = new URL(request.url)
  
  return new Promise((resolve, reject) => {
    if (url.searchParams.get('edit')) {
      return resolve(
        dbRead(url.pathname)
          .then(content => respond(form(content)))
      )
    }
     
    return reject(request)
  })
}

self.addEventListener('fetch', e => {
  e.respondWith(
    create(e.request)
      .catch(newForm)
      .catch(read)
      .catch(fetch)
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
