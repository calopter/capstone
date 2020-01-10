const { template, form } = require('./view')
const { dbGet, dbRead, dbSet } = require('./db')

dbSet('/hello', "<a href='hello?edit=true'>hello world from db</a>")
dbSet('/index', "<a href='/new'>some new content</a>")
dbSet('/hi', 'hi')
dbSet('empty', null)

const respond = (body, url) => {
  const headers = { headers: { 'Content-Type': 'text/html' }}
  return new Response(template(url, () => body), headers)
}

const read = request => {
  const url = new URL(request.url)

  return new Promise((resolve, reject) => {
    return caches.match(request).then(response => {
      if (response) return resolve(response)
      return dbGet(url.pathname, request)
    }).then(content => resolve(respond(content, url))).catch(reject)
  })
}

const write = request => {
  return new Promise((resolve, reject) => {
    if (request.method === 'POST') {
      return request.formData().then(data => {
        const title = new URL(request.url).pathname
        const body = data.get('body')

        return dbSet(title, body)
      }).then(body => resolve(respond(body, request.url)))
    }
    return reject(request)
  })
}

const newForm = request => {
  const url = new URL(request.url)
  
  return new Promise((resolve, reject) => {
    if (url.searchParams.get('edit')) {
      return resolve(
        dbRead(url.pathname)
          .then(content => respond(form(content), url))
      )
    }
     
    return reject(request)
  })
}

const create = request => {
  const {
    cache, credentials, headers, integrity, method,
    mode, redirect, referrer, referrerPolicy, url, body
  } = request

  const init = {
    cache, credentials, headers, integrity, method,
    mode: 'same-origin', redirect, referrer, referrerPolicy, body
  }
  
  // add ?edit=true to url
  const newReq = new Request(url + '?edit=true', init)
  
  // send to newForm
  return newForm(newReq)
}

module.exports = { write, newForm, read, create }
