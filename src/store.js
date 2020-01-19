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
      
      list.map(([{ key }]) => {
        key = key.slice(5)
        links += `- [${key}](/${key})\n`
      })
      
      console.log('links:', links)
      state.links = html`${raw(md.render(links))}`

      emitter.emit('render')
    })
  }

  emitter.on('DOMContentLoaded', async () => {
    state.db = new WikiDb()
    await state.db.init()

    const welcome = `# welcome\n\n***\n\n [hello](/${state.db.time})`
    await state.db.put('welcome', welcome)
    await state.db.put(`${state.db.time}`, `hello world from ${state.db.name}`)

    state.db.swarm.on('connection', async peer => {
      console.log('connected')
      try {
        const auth = await state.db.connect(peer)
        console.log(auth)
      } catch (err) { console.log(err) }
      setTimeout(updateLinks, 1000)
    })

    await updateLinks()
    
    state.db.db.watch('wiki', () => {
      console.log('change')
      updateLinks()
    })
        
    state.params.wildcard ?
      emitter.emit('pushState', `/${state.params.wildcard}`)
      : emitter.emit('pushState', '/welcome')
  })

  emitter.on('navigate', () => {
    const path = state.params.wildcard
    state.db.fetch(path).then(doc => {
      state.doc = doc 
      state.html = html`${raw(md.render(doc))}`
      emitter.emit('render')
    }).catch(() => {
      // we're creating
      state.db.put(path, `# ${state.params.wildcard}\n\n***`)
        .then(() => {
          emitter.emit('pushState', `/${path}?edit=true`)
        })
    })
  })

  emitter.on('content-submitted', input => {
    const path = state.params.wildcard
    state.db.put(path, input.body)
      .then(() => {
        emitter.emit('pushState', `/${path}`)
      }).catch(console.log)
  })
}
