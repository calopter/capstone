const html = require('choo/html')
const raw = require('nanohtml/raw')

const nav = (props, emit) => {
  const { path, editing } = props
  
  const view = html`
    <nav class="bg-light-green">
      <a class="link dim mid-gray f6 f5-ns dib mv4 ml3 mr4"
        onclick=${() => emit('index')}>index</a>
      <a class="link dim mid-gray f6 f5-ns dib mv4"
        href="/${path}?edit=true">edit</a>
    </nav>
  `
  
  const edit = html`
    <nav class="flex justify-between bg-light-green mid-gray mw-100">
      <div>
        <a class="link dim mid-gray f6 f5-ns dib mt2 mb1 ml3"
        onclick=${() => emit('index')}>index</a>
        <p class="f6 mt1 mb2 ml3">
          editing: <a class="link" href="/${path}">
            ${path}
          </a>
        </p>
      </div>
      <div class="flex flex-column justify-around w-25 mr3 min-h-100">
        <button class="center f6 w-100 border-box grow br-pill ba bw1
        ph3 pt1 pb3 h-50 mr4-ns bg-washed-green dim mid-gray"
        type="submit"
        form="content"/>
          submit
        </button>
      </div>
    </nav>
  `

  return editing ? edit : view
}

const edit = (props, emit) => {
  const onSubmit = e => {
    e.preventDefault()
    const input = {}
    const data = new FormData(e.currentTarget).entries()
    for(const [key, value] of data) input[key] = value
    
    emit('content-submitted', input)
  }

  return html`
      <section>
        <form class="pt1 black-80" id="content" onsubmit=${onSubmit}>
          <div class="flex flex-wrap justify-center h-75">
            <textarea class="bg-washed-green input-reset dib
              border-box ba b--black-20 pa2 br2 mh2 h-100 w-100"
              id="body" name="body" autofocus>${props.doc}</textarea>
          </div>
        </form>
      </section>
  `
}
 
const display = props => {
  return html`
    <section class="mid-gray mh3 mv4 f5 lh-copy">
      ${props.docHtml}
    </section>
    <section class="mid-gray mh3 mv4 f5 lh-copy">
      ${props.links}
    </section>
  `
}

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
