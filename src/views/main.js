const html = require('choo/html')
const nav = require('./components/nav')
const edit = require('./components/edit')
const display = require('./components/display')
const index = require('./components/index')

module.exports = (state, emit) => {
  const { init, doc, docHtml, links, key } = state
  const path = state.params.wildcard
  const editing = state.query.edit
  
  return html`
    <body class="bg-washed-green">
      ${ nav({ path, editing }, emit) }
      ${ state.index ? index({ links, key }, emit) : '' }
      ${ editing ?
        edit({ doc }, emit) :
        display({ docHtml, links }) }
    </body>
  `
}
