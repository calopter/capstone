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
    <div>
      <h1 >${state.body}</h1>
      <button onclick=${() => emit('stamp', (new Date).toTimeString())}>stamp</button>
      <button onclick=${() => emit('refresh')}>refresh</button>
    </div>
  `
}

const app = choo()
app.use(archive)
app.route('/', main)
app.mount('div')

if('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
  })
}
