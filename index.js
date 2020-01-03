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
}

const main = (state, emit) => {
  return html`
    <body class="bg-light-green">
      <main class="ma6">
        <h1 class="f6-l fw6 ttu tracked">${state.body}</h1>
        <button
          class="ph3 f6 grow no-underline br-pill ba bw1 ph3 pv2 mb2 dib light-purple"
          onclick=${() => emit('stamp', (new Date).toTimeString())}>stamp</button>
        <button
          class="ph3 f6 grow no-underline br-pill ba bw1 ph3 pv2 mb2 dib light-purple"
          onclick=${() => emit('refresh')}>refresh</button>
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
