const html = require('choo/html')
const raw = require('nanohtml/raw')
const pump = require('pump')

const initDB = require('./db')

module.exports = (state, emitter) => {
  const updateLinks = () => {
    console.log('found stuff')
    const h = state.db.db.createHistoryStream({ reverse: true })
    const ws = state.db.forEachChunk(
      { objectMode: true },
      (data, enc, next) => {
        const { key, value } = data
        state.links.push(`
          <li><a href=${key.slice(9)}>${key}</a></li>
        `)
      next()
    })
    
    pump(h, ws, () => console.log('pumped'))
  }

  state.links = []
  
  emitter.on('DOMContentLoaded', async () => {
    state.db = await initDB()
    state.doc = html`
      <div>
        <a href=${state.db.name}>welcome</a>
      </div>
    `
    
    state.db.db.watch('trieWiki', updateLinks)

    emitter.emit('render')
  })

  emitter.on('navigate', () => {
    console.log('href:', state.href)
    state.db.fetch(state.href).then(doc => {
      state.doc = html`${raw(doc)}`
      emitter.emit('render')
    })
  })
}
