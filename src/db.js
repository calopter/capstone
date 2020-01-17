const hyperdb = require('hyperdb')
const rai = require('random-access-idb')
const html = require('choo/html')
const raw = require('nanohtml/raw')
const swarm = require('@geut/discovery-swarm-webrtc')
const { Writable } = require('stream')

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

module.exports = async () => {
  // simulate different user-device's Storages:
  let name //= localStorage.getItem('trieWiki-rai-name')
  // if (!name) {
  name = `trieWiki/${Date.now()}`
  //   localStorage.setItem('trieWiki-rai-name', name)
  // }
  // console.log('using rai name:', name)

  // definitely get that key tho:
  const key = localStorage.getItem('trieWiki-hyperdb-key')
  // console.log('using key', key)

  const db = hyperdb(rai(name), key, {valueEncoding: 'utf-8'})

  db.on('ready', () => {
    if (!key) {
      localStorage.setItem('trieWiki-hyperdb-key',
        db.key.toString('hex'))
    }
    // console.log('hyperdb key:', db.key.toString('hex'))

    db.put(name, `hello world from ${name}`, err => {
      if (err) return console.log(err)

      const sw = swarm({
        stream: () => db.replicate({ live: true, userData: JSON.stringify({ key: db.local.key})}),
        bootstrap: ['localhost:4000', 'https://geut-webrtc-signal.herokuapp.com/']
      })

      sw.join(db.discoveryKey)

      sw.on('connection', conn => console.log('connected:', conn))
      // db.get(name, (err, nodes) => console.log('self-read:', nodes[0].value))
    })
  })
  
  const fetch = async path => {
    return new Promise((resolve, reject) => {
      db.get(path, (err, nodes) => {
        if (err) return reject(err)
        if (!nodes[0]) return reject()
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

  return { db, fetch, put, name, forEachChunk }
}
