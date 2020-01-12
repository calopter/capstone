const { write, newForm, readOrCreate } = require('./controller')

const routes = [
  [ ({ method }) => method === 'POST', write ],
  [ ({ url }) => new URL(url).searchParams.get('edit'), newForm ],  [ (_) => true, readOrCreate],
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
