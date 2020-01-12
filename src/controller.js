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

const write = async request => {
  if (!(request.method === 'POST')) throw(request)

  try {
    const title = new URL(request.url).pathname
    const data = await request.formData()
    await dbSet(title, data.get('body'))

    return Response.redirect(title)
  }
  catch (err) { throw(request) }
}

const newForm = async request => {
  const url = new URL(request.url)
  if (!url.searchParams.get('edit')) throw(request)

  try {
    const content = await dbRead(url.pathname)
    
    if (content) return respondForm(url, content)
    return respondForm(url, `# ${url.pathname.slice(1)}\n\n***`)
  }
  catch (err) { throw(request) }
}

const readCache = async request => {
  try {
    const response = await caches.match(request)
    if (!response) throw(request)
    return response
  }
  catch (err) { throw(request) }
}

const readDb = async request => {
  const url = new URL(request.url)

  try {
    const content = await dbGet(url.pathname, request)
    return respondMD(url, content)
  }
  catch (err) { throw(request) }
}

const create = ({ url }) => Response.redirect(url + '?edit=true')

const readOrCreate = request =>
  readCache(request).catch(readDb).catch(create)

module.exports = { write, newForm, readOrCreate }
