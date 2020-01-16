const choo = require('choo')
const main = require('./view')
const archive = require('./store')

const app = choo()
app.use(archive)
app.route('/*', main)
app.mount('body')

// if('serviceWorker' in navigator) {
//   //var prevents overeager bundling
//   const swName = '/service-worker.js'
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register(swName)
//   })
// }
