const hyperdb = require('hyperdb')
const rai = require('random-access-idb')
const swarm = require('@geut/discovery-swarm-webrtc')

module.exports = class WikiDb {
  constructor (key, name) {
    this.key = key
    this.name = name
    
    console.log('using rai name:', this.name)
    
    this.db = hyperdb(rai(this.name), this.key, {valueEncoding: 'utf-8'})
  }

  async init () {
    await this._ready()

    this._swarm()
    
    this.key = this.db.key.toString('hex')
    console.log('hyperdb key:', this.key)
    return this.key
  }

  fetch (path) {
    return new Promise((resolve, reject) => {
      this.db.get(`wiki/${path}`, (err, nodes) => {
        if (err) return reject(err)
        if (!nodes[0]) return reject()
        resolve(nodes[0].value)
      })
    })
  }

  put (key, val) {
    return new Promise((resolve, reject) => {
      this.db.put(`wiki/${key}`, val, err => {
        if (err) return reject(err)
        resolve(`stored to ${key}`)
      })
    })
  }

  list () {
    return new Promise((resolve, reject) => {
      this.db.list((err, list) => {
        if (err) return reject(err)
        return resolve(list)
      })
    })
  }

  async connect (peer) {
    if (!peer.remoteUserData) throw new Error('no remoteUserData')
    const data = JSON.parse(peer.remoteUserData)
    const key = Buffer.from(data.key)

    return await this._authorize(key)
  }

  _authorize (key) {
    return new Promise((resolve, reject) => {
      this.db.authorized(key, (err, auth) => {
        if (err) return reject(err)
        if (auth) return resolve('already authorized')

        this.db.authorize(key, err => {
          if (err) return reject(err)
          resolve('authorized')
        })
      })
    })
  }
  
  _ready () {
    return new Promise(resolve => this.db.ready(resolve))
  }

  _swarm () {
    const key = this.db.local.key
    const stream = () => this.db.replicate({
      live: true,
      userData: JSON.stringify({ key })
    })
    
    this.swarm = swarm({
      stream,
      bootstrap: ['https://geut-webrtc-signal.herokuapp.com/']
    })

    this.swarm.join(this.db.discoveryKey)
    
    this.swarm.on('connection', () => {
      this.peerCount = this.peerCount ? this.peerCount + 1 : 1
    })
    
    this.swarm.on('connection-closed', () => {
      this.peerCount = this.peerCount > 1 ? this.peerCount - 1 : null
    })
  }
}
