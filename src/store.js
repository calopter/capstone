const html = require('choo/html')
const raw = require('nanohtml/raw')
const pump = require('pump')
const { Remarkable } = require('remarkable')

const initDB = require('./db')
const md = new Remarkable()

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

    const index = `# index\n\n***\n\n [welcome](${state.db.name})`
    await state.db.put('/index', index)
    
    state.params.wildcard ?
      emitter.emit('pushState', `/${state.params.wildcard}`)
      : emitter.emit('pushState', '/index')
  })

  emitter.on('navigate', () => {
    const path = `/${state.params.wildcard}`
    state.db.fetch(path).then(doc => {
      state.doc = doc 
      state.html = html`${raw(md.render(doc))}`
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
