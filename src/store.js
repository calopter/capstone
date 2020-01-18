const html = require('choo/html')
const raw = require('nanohtml/raw')
const { Remarkable } = require('remarkable')

const WikiDb = require('./db')

const md = new Remarkable()

module.exports = (state, emitter) => {
  const updateLinks = async () => {
    // console.log('updating links')
    
    let links = ''
    
    await state.db.db.list(async (err, list) => {
      if (err) return console.log(err)
      
      list.map(([{ key }]) => links += `- [${key}](/${key})\n`)
      
      console.log('links:', links)
      await state.db.put('/index', links)
    })

    if (state.params.wildcard === 'index') {
      emitter.emit('replaceState', '/index')
    }
  }

  emitter.on('DOMContentLoaded', async () => {
    state.db = new WikiDb()
    await state.db.init()
    
    state.db.swarm.on('connection', conn => {
      console.log('connected')
      setTimeout(updateLinks, 1000)
    })

    const welcome = `# welcome\n\n***\n\n [hello](/${state.db.time})`
    await state.db.put('/welcome', welcome)
    await state.db.put(`${state.db.time}`, `hello world from ${state.db.name}`)

    await updateLinks()
    
    state.params.wildcard ?
      emitter.emit('pushState', `/${state.params.wildcard}`)
      : emitter.emit('pushState', '/welcome')
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
