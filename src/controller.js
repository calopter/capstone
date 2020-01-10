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
      const title = new URL(request.url).pathname
      return request.formData().then(data => {
        const body = data.get('body')
        return dbSet(title, body)
      }).then(body => resolve(Response.redirect(title)))
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
          .then(content => respond(form(url, content), url))
      )
    }
     
    return reject(request)
  })
}

const create = ({ url }) => Response.redirect(url + '?edit=true')

module.exports = { write, newForm, read, create }
