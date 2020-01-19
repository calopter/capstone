const html = require('choo/html')
const raw = require('nanohtml/raw')

module.exports = (state, emit) => {
  const onSubmit = e => {
    e.preventDefault()
    const input = {}
    const data = new FormData(e.currentTarget).entries()
    for(const [key, value] of data) input[key] = value
    
    emit('content-submitted', input)
  }

  const path = state.params.wildcard

  const edit = html`
    <body class="bg-washed-green">
      <nav class="flex justify-between bg-light-green mid-gray mw-100">
        <div>
          <a class="link dim mid-gray f6 f5-ns dib mt2 mb1 ml3"
          href="/index">index</a>
          <p class="f6 mt1 mb2 ml3">
            editing: <a class="link" href="/${path}">
              ${path}
            </a>
          </p>
        </div>
        <div class="flex flex-column justify-around w-25 mr3 min-h-100">
          <label class="f6 h-50 border-box grow br-pill ba b--black-20 bw1
            h-10 bg-washed-green dim mid-gray">
            <span class="pl4 pa4">+</span>
            <input class="h1 db o-0" form="content" type="file" id="file"/>
          </label>
        </div>
        <div class="flex flex-column justify-around w-25 mr3 min-h-100">
          <button class="f6 w-100 border-box grow br-pill ba bw1
          ph3 pt2 pb3 h-50 mr4-ns bg-washed-green dim mid-gray"
          type="submit"
          form="content"/>
            submit
          </button>
        </div>
      </nav>
      <section>
        <form class="pt1 black-80" id="content" onsubmit=${onSubmit}>
          <div class="flex flex-wrap justify-center h-75">
            <textarea class="bg-washed-green input-reset dib
              border-box ba b--black-20 pa2 br2 mh2 h-100 w-100"
              id="body" name="body" autofocus>${state.doc}</textarea>
          </div>
        </form>
      </section>
    </body>
  `
 
  const display = html`
    <body class="bg-washed-green">
      <nav class="bg-light-green">
        <a class="link dim mid-gray f6 f5-ns dib mv4 ml3 mr4"
          href="/index">index</a>
        <a class="link dim mid-gray f6 f5-ns dib mv4"
          href="/${path}?edit=true">edit</a>
      </nav>
      <section class="mid-gray mh3 mv4 f5 lh-copy">
        ${state.html}
      </section>
      <section class="mid-gray mh3 mv4 f5 lh-copy">
        ${state.links}
      </section>
    </body>
  `

  return state.query.edit ? edit : display
}
