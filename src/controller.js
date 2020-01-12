const { template, form } = require('./view')
const { dbGet, dbRead, dbSet } = require('./db')

const respondMD = (url, body) => {
  const headers = { headers: { 'Content-Type': 'text/html' }}
  return new Response(template(url, () => body), headers)
}

const respondForm = (url, content) => {
  const headers = { headers: { 'Content-Type': 'text/html' }}
  return new Response(form(url, content), headers)
}

const read = async request => {
  const url = new URL(request.url)
  try {
    const response = await caches.match(request)
    if (response) return response
    const content = await dbGet(url.pathname, request)
    return respondMD(url, content)
  }
  catch (err) {
    throw(request)
  }
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
          .then(content => {
            if (!content) {
              return respondForm(url,
                `# ${url.pathname.slice(1)}\n\n***`
              )
            }
            return respondForm(url, content)
          })
      )
    }
     
    return reject(request)
  })
}

const create = ({ url }) => Response.redirect(url + '?edit=true')

module.exports = { write, newForm, read, create }
