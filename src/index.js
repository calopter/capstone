const hyperdb = require('hyperdb')
const rai = require('random-access-idb')
const DiscoverySwarmWeb = require('discovery-swarm-web')

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

  db.put(now, 'world', err => {
    if (err) return console.log(err)
    
    // const swarm = DiscoverySwarmWeb({
    //   stream: () => db.replicate()
    // })

    // swarm.join(db.discoveryKey)
    db.get(now, (err, nodes) => console.log('read:', now, nodes[0].value))
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
