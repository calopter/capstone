const hyperdb = require('hyperdb')
const rai = require('random-access-idb')

const swarm = require('@geut/discovery-swarm-webrtc')

// simulate different user-device's Storages:
let name //= localStorage.getItem('trieWiki-rai-name')
// if (!name) {
  name = `trieWiki-${Date.now()}`
//   localStorage.setItem('trieWiki-rai-name', name)
// }
console.log('using rai name:', name)

// definitely get that key tho:
const key = localStorage.getItem('trieWiki-hyperdb-key')
console.log('using key', key)

const db = hyperdb(rai(name), key, {valueEncoding: 'utf-8'})
const now = '/hello'+Date.now()

db.on('ready', () => {
  if (!key) localStorage.setItem('trieWiki-hyperdb-key', db.key.toString('hex')) 
  console.log('hyperdb key:', db.key.toString('hex'))

  db.put(name, `hello world from ${name}`, err => {
    if (err) return console.log(err)
    
    const sw = swarm({
      stream: () => db.replicate({ live: true, userData: JSON.stringify({ key: db.local.key})}),
      bootstrap: ['localhost:4000']
    })

    sw.join(db.discoveryKey)

    sw.on('connection', conn => console.log('connected:', conn))
    
    db.get(name, (err, nodes) => console.log('self-read:', now, nodes[0].value))
  })
})

console.log(db)

if('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(() => console.log('sw registered'))
      .catch(console.log)
  })
}
