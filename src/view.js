const html = require('choo/html')
const raw = require('nanohtml/raw')

module.exports = (state, emit) => {
  const onSubmit = e => {
    e.preventDefault()
    const input = {}
    const data = new FormData(e.currentTarget).entries()
    for(const [key, value] of data) input[key] = value
    
    console.log(input)
    emit('content-submitted', input)
  }
  
  const onLookup = e => {
    e.preventDefault()
    const title = new FormData(e.currentTarget).values().next().value
    emit('lookup', title)
  }
  
  return html`
    <body class="bg-washed-green">
      <nav class="bg-light-green">
        <a class="link dim mid-gray f6 f5-ns dib mv4 ml3 mr4"
          href="/index">index</a>
        <a class="link dim mid-gray f6 f5-ns dib mv4"
          href="#">edit</a>
      </nav>
      <section class="mid-gray mh3 mv4 f5 lh-copy">
        ${state.doc}
        <ul>
          ${state.links.map(raw)}
        </ul>
      </section>
    </body>
  `
}
