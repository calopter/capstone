const html = require('choo/html')
const nav = require('./components/nav')
const edit = require('./components/edit')
const display = require('./components/display')

module.exports = (state, emit) => {
  const { init, doc, docHtml, links } = state
  const path = state.params.wildcard
  const editing = state.query.edit
  
  return html`
    <body class="bg-washed-green">
      ${nav({ path, editing }, emit)}
      ${editing ?
        edit({ doc }, emit) :
        display({ docHtml, links })}
    </body>
  `
}
