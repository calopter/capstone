const hyperdb = require('hyperdb')
const rai = require('random-access-idb')
const html = require('choo/html')
const raw = require('nanohtml/raw')
const swarm = require('@geut/discovery-swarm-webrtc')
const { Writable } = require('stream')
const pump = require('pump')

class ForEachChunk extends Writable {
  constructor (opts, cb) {
    if (!cb) {
      cb = opts
      opts = {}
    }
    super(opts)
    this.cb = cb
  }

  _write (chunk, enc, next) {
    this.cb(chunk, enc, next)
  }
}

const forEachChunk = (...args) => new ForEachChunk(...args)

const initDB = () => {
  // simulate different user-device's Storages:
  let name //= localStorage.getItem('trieWiki-rai-name')
  // if (!name) {
  name = `trieWiki/${Date.now()}`
  //   localStorage.setItem('trieWiki-rai-name', name)
  // }
  console.log('using rai name:', name)

  // definitely get that key tho:
  const key = localStorage.getItem('trieWiki-hyperdb-key')
  // console.log('using key', key)

  const db = hyperdb(rai(name), key, {valueEncoding: 'utf-8'})

  db.on('ready', () => {
    if (!key) {
      localStorage.setItem('trieWiki-hyperdb-key',
        db.key.toString('hex'))
    }
    console.log('hyperdb key:', db.key.toString('hex'))

    db.put(name, `hello world from ${name}`, err => {
      if (err) return console.log(err)

      const sw = swarm({
        stream: () => db.replicate({ live: true, userData: JSON.stringify({ key: db.local.key})}),
        bootstrap: ['localhost:4000']
      })

      sw.join(db.discoveryKey)

      sw.on('connection', conn => console.log('connected:', conn))
      db.get(name, (err, nodes) => console.log('self-read:', nodes[0].value))
    })
  })
  
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

  return { db, fetch, put, name }
}
    

module.exports = (state, emitter) => {
  state.links = []
  
  emitter.on('DOMContentLoaded', async () => {
    state.db = await initDB()
    state.doc = html`
      <div>
        <a href=${state.db.name}>welcome</a>
      </div>
    `
      
    state.db.db.watch('trieWiki', () => {
      console.log('found stuff')
      const h = state.db.db.createHistoryStream({ reverse: true })
      const ws = forEachChunk({ objectMode: true }, (data, enc, next) => {
        const { key, value } = data
        state.links.push(`<li><a href=${key.slice(9)}>${key}</a></li>`)
        next()
      })
      pump(h, ws, () => console.log('pumped'))
    })

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
