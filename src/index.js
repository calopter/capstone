const hyperdb = require('hyperdb')
const rai = require('random-access-idb')
const choo = require('choo')
const html = require('choo/html')

const db = hyperdb(rai('./my.db'), {valueEncoding: 'utf-8'})

const fetch = async path => {
  return new Promise((resolve, reject) => {
    db.get(path, (err, nodes) => {
      if (err) return reject(err)
      if (!nodes[0]) return reject('path not found')
      resolve(nodes[0].value)
    })
  })
}

const put = async (key, val) => {
  return new Promise((resolve, reject) => {
    db.put(key, val, err => {
      if (err) return reject(err)
      resolve(`stored to ${key}`)
    })
  })
}

const archive = (state, emitter) => {
  state.body = 'hello'

  emitter.on('refresh', () => {
    fetch('/hello').then(data => {
      state.body = data
      emitter.emit('render')
    }).catch(console.log)
  })

  emitter.on('stamp', time => {
    put('/hello', time).then(console.log).catch(console.log)
    state.body = time
    emitter.emit('render')
  })

  emitter.on('content-submitted', ({ title, content }) => {
    put(title, content)
    state.body = `${title}\n\n${content}`
    emitter.emit('render')
  })

  emitter.on('lookup', title => {
    fetch(title).then(data => {
      state.body = `${title}\n\n${data}`
      emitter.emit('render')
    }).catch(console.log)
  })
}

const main = (state, emit) => {
  const onSubmit = e => {
    e.preventDefault()
    const input = {}
    const data = new FormData(e.currentTarget).entries()
    for(const [key, value] of data) input[key] = value
    
    console.log(input)
    emit('content-submitted', input)
  }
  
  const onLookup = e => {
    e.preventDefault()
    const title = new FormData(e.currentTarget).values().next().value
    emit('lookup', title)
  }
  
  return html`
    <body class="bg-light-green">
      <main class="ma6">
        <h1 class="f6-l fw6 ttu tracked">${state.body}</h1>
        <button
          class="f6 grow no-underline br-pill ba bw1 ph3 pv2 mb2 dib light-purple"
          onclick=${() => emit('stamp', (new Date).toTimeString())}>stamp</button>
        <button
          class="ph3 f6 grow no-underline br-pill ba bw1 ph3 pv2 mb2 dib light-purple"
          onclick=${() => emit('refresh')}>refresh</button>
        <form class="pa4 black-80" onsubmit=${onLookup}>
          <fieldset class="ba b--transparent ph0 mh0">
            <input class="ma2 ba w-100 pa3" name="title" type="text"/>
            <input type="submit" value="lookup"
              class="f6 grow no-underline br-pill ba bw1 ph3 pv2 mb2 dib light-purple"/>
          </fieldset>
        </form>
        <form class="pa4 black-80" onsubmit=${onSubmit}>
          <fieldset class="ba b--transparent ph0 mh0">
            <input class="ma2 ba w-100 pa3" name="title" type="text"/>
            <input class="ma2 ba w-100 pa3" name="content" type="text-area"/>
            <input type="submit" value="submit"
              class="f6 grow no-underline br-pill ba bw1 ph3 pv2 mb2 dib light-purple"/>
          </fieldset>
        </form>
      </main>
    </body>
  `
}

const app = choo()
app.use(archive)
app.route('/', main)
app.mount('body')

if('serviceWorker' in navigator) {
  const swName = '/service-worker.js'
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(swName)
  })
}
