const html = require('choo/html')
const nav = require('./components/nav')
const edit = require('./components/edit')
const display = require('./components/display')
const index = require('./components/index')

module.exports = (state, emit) => {
  const { init, doc, docHtml, links, key } = state
  const peers = state.db ? state.db.peerCount : null
  const path = state.params.wildcard
  const editing = state.query.edit
  
  return html`
    <body class="bg-washed-green">
      ${ nav({ path, editing, peers }, emit) }
      ${ state.index ? index({ links, key }, emit) : '' }
      ${ editing ?
        edit({ doc }, emit) :
        display({ docHtml, links }) }
    </body>
  `
}
