const hyperdb = require('hyperdb')
const rai = require('random-access-idb')
const swarm = require('@geut/discovery-swarm-webrtc')

module.exports = class WikiDb {
  constructor () {
    this.time = Date.now()
    
    // this.name = localStorage.getItem('trieWiki-rai-name')
    // if (!this.name) {
    this.name = `trieWiki/${this.time}`
    //   localStorage.setItem('trieWiki-rai-name', name)
    // }
    console.log('using rai name:', this.name)

    // definitely get that key tho:
    this.key = localStorage.getItem('trieWiki-hyperdb-key')
    this.db = hyperdb(rai(this.name), this.key, {valueEncoding: 'utf-8'})
  }

  async init () {
    await this._ready()
    
    if (!this.key) {
      this.key = this.db.key.toString('hex')
      localStorage.setItem('trieWiki-hyperdb-key', this.key)
    }
    // console.log('hyperdb key:', db.key.toString('hex'))
    // console.log('using key', key)
    
    this._swarm()
  }
  
  async fetch (path) {
    return new Promise((resolve, reject) => {
      this.db.get(path, (err, nodes) => {
        if (err) return reject(err)
        if (!nodes[0]) return reject()
        resolve(nodes[0].value)
      })
    })
  }

  async put (key, val) {
    return new Promise((resolve, reject) => {
      this.db.put(key, val, err => {
        if (err) return reject(err)
        resolve(`stored to ${key}`)
      })
    })
  }

  _ready () {
    return new Promise(resolve => this.db.ready(resolve))
  }

  _swarm () {
    this.swarm = swarm({
      stream: () => this.db.replicate({ live: true, userData: JSON.stringify({ key: this.db.local.key})}),
      bootstrap: ['localhost:4000']
    })

    this.swarm.join(this.db.discoveryKey)
    // console.log('joined')

    // console.log('sw', this.swarm)
  }
}
