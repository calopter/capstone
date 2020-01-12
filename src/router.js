const { write, newForm, readOrCreate } = require('./controller')

const route = e => {
  e.respondWith(
    write(e.request)
      .catch(newForm)
      .catch(readOrCreate)//.catch(fetch)
  )
}

module.exports = route
