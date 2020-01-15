const swarm = require('@geut/discovery-swarm-webrtc')
const signalhub = require('signalhubws')
const pump = require('pump')

const hyperdb = require('hyperdb')
const rai = require('random-access-idb')

const db = hyperdb(rai('test'), {valueEncoding: 'utf-8'})
const now = '/hello'+Date.now()
db.put(now, 'world')

const sw = swarm({
  stream: () => db.replicate({ live: true }),
})

sw.join(
  signalhub('hello', ['wss://signalhubws-olaf.glitch.me']),
  { config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302'}]}}
)

sw.on('connection', conn => {
  console.log('connected', conn)
  // pump(conn, db.replicate({live: true}), conn, err => { throw err})//console.log)
  setTimeout(db.get(now, console.log), 2000)
})

console.log(db)

if('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(() => console.log('sw registered'))
      .catch(console.log)
  })
}
