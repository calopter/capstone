const { write, newForm, readOrCreate } = require('./controller')

const post = ({ method }) => method === 'POST'
const edit = ({ url }) => new URL(url).searchParams.get('edit')
const image = ({ destination }) => destination === 'image'
const base = (_) => true

const routes = [
  [ post, write ],
  [ edit, newForm ],
  [ image, req => caches.match(req).catch(fetch) ],
  [ base, readOrCreate ],
]

const route = e => {
  for (const [pred, action] of routes) {
    if (pred(e.request)) {
      e.respondWith(action(e.request))
      break
    }
  }
}

module.exports = route
