const html = require('choo/html')

module.exports = (state, emit) => {
  const onSubmit = e => {
    e.preventDefault()
    
    const input = {}
    const data = new FormData(e.currentTarget).entries()
    for(const [key, value] of data) input[key] = value

    emit('init', input)
  }
  
  return html`
    <body class="bg-washed-green">
      <nav class="bg-light-green pv4 h3"></nav>
      <section class="flex flex-wrap justify-center mid-gray
        mh-100 mw-90 w-90 pa4 center tc">
        <h1 class="f1 lh-title mv2">welcome</h1>
        <h1 class="f2 lh-title">
          use a key, or enter to create a new wiki
        </h4>
        <form class="pt1 black-80" id="content" onsubmit=${onSubmit}>
            <input class="input-reset mid-gray ba b--black-20 pa2
              mb2 db w-100"
              type="text"
              id="key" name="key"
              value="${state.key}"/>
              
          <button class="center f6 w-100 border-box grow br-pill ba bw1
          ph3 pv2 h-50 mr4-ns bg-washed-green dim mid-gray"
          type="submit"/>
            enter
          </button>          

        </form>
      </section>
    </body>
  `
}
