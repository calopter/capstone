const html = require('choo/html')
const raw = require('nanohtml/raw')
const pump = require('pump')

const initDB = require('./db')

module.exports = (state, emitter) => {
  const updateLinks = () => {
    // console.log('found stuff')
    const h = state.db.db.createHistoryStream({ reverse: true })
    const ws = state.db.forEachChunk(
      { objectMode: true },
      (data, enc, next) => {
        const { key, value } = data
        state.links.push(`
          <li><a href="/${key}">${key}</a></li>
        `)
      next()
    })
    
    pump(h, ws, () => console.log('pumped'))
    emitter.emit('render')
  }

  state.links = []
  
  emitter.on('DOMContentLoaded', async () => {
    state.db = await initDB()
    state.db.db.watch('trieWiki', updateLinks)

    const index = `
      <div>
        <a href="/${state.db.name}">welcome</a>
      </div>
    `

    await state.db.put('/index', index)
    
    state.params.wildcard ?
      emitter.emit('pushState', `/${state.params.wildcard}`)
      : emitter.emit('pushState', '/index')
  })

  emitter.on('navigate', () => {
    const path = `/${state.params.wildcard}`
    state.db.fetch(path).then(doc => {
      state.doc = doc 
      state.html = html`${raw(doc)}`
      emitter.emit('render')
    }).catch(() => {
      // we're creating
      state.db.put(path, `# ${state.params.wildcard}\n\n***`)
        .then(() => {
          emitter.emit('pushState', `${path}?edit=true`)
        })
    })
  })

  emitter.on('content-submitted', input => {
    const path = `/${state.params.wildcard}`
    state.db.put(path, input.body)
      .then(() => {
        emitter.emit('pushState', path)
      }).catch(console.log)
  })
}
