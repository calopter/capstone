const html = require('choo/html')
const raw = require('nanohtml/raw')
const { Remarkable } = require('remarkable')

const WikiDb = require('./db')

const md = new Remarkable()

module.exports = (state, emitter) => {
  const updateLinks = async () => {
    let links = ''
    const pages = await state.db.list()
    
    pages.map(([{ key }]) => {
      key = key.slice(5) // removes 'wiki/' 
      links += `- [${key}](/${key})\n`
    })
      
    console.log('links:', links)
    state.links = html`${raw(md.render(links))}`
    emitter.emit('render')
  }

  const initDb = async () => {
    state.db = new WikiDb(state.key)
    await state.db.init()

    const welcome = `# welcome\n\n***\n\n [hello](/${state.db.time})`
    await state.db.put('welcome', welcome)
    await state.db.put(`${state.db.time}`, `hello world from ${state.db.name}`)

    state.db.swarm.on('connection', async peer => {
      console.log('connected', state.db.peerCount)
      try {
        const auth = await state.db.connect(peer)
        console.log(auth)
        updateLinks()
      } catch (err) { console.log(err) }
      
      emitter.emit('navigate')
    })

    state.db.swarm.on('connection-closed', () => {
      emitter.emit('render')
    })

    updateLinks()
    
    state.db.db.watch('wiki', () => {
      updateLinks()
      // reload
      emitter.emit('navigate')
    })

    return state.db.key
  }
    
  emitter.on('DOMContentLoaded', () => {
    state.key = localStorage.getItem('trieWiki-hyperdb-key')
    
    state.params.wildcard ?
      emitter.emit('init', { key: state.key }) :
      emitter.emit('render')
  })

  emitter.on('init', async ({ key }) => {
    state.key = await initDb()
    
    localStorage.setItem('trieWiki-hyperdb-key', state.key)
    emitter.emit('pushState', '/welcome')
  })

  emitter.on('navigate', () => {
    const path = state.params.wildcard
    state.index = false
    
    state.db.fetch(path).then(doc => {
      state.doc = doc 
      state.docHtml = html`${raw(md.render(doc))}`
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

  emitter.on('index', () => {
    state.index = !state.index
    emitter.emit('render')
  })
}
