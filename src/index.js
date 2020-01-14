const swarm = require('@geut/discovery-swarm-webrtc')

const sw = swarm({
  bootstrap: ['172.24.47.182:4000']
})

sw.join(Buffer.from('some-topic'))

sw.on('connection', peer => {
  console.log('connected', peer)
})

if('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(() => console.log('sw registered'))
      .catch(console.log)
  })
}
