const html = require('choo/html')

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
    <body class="bg-light-green">
      <main class="ma6">
        <h1 class="f6-l fw6 ttu tracked">${state.body}</h1>
        <button
          class="f6 grow no-underline br-pill ba bw1 ph3 pv2 mb2 dib light-purple"
          onclick=${() => emit('stamp', (new Date).toTimeString())}>stamp</button>
        <button
          class="ph3 f6 grow no-underline br-pill ba bw1 ph3 pv2 mb2 dib light-purple"
          onclick=${() => emit('refresh')}>refresh</button>
        <form class="pa4 black-80" onsubmit=${onLookup}>
          <fieldset class="ba b--transparent ph0 mh0">
            <input class="ma2 ba w-100 pa3" name="title" type="text"/>
            <input type="submit" value="lookup"
              class="f6 grow no-underline br-pill ba bw1 ph3 pv2 mb2 dib light-purple"/>
          </fieldset>
        </form>
        <form class="pa4 black-80" onsubmit=${onSubmit}>
          <fieldset class="ba b--transparent ph0 mh0">
            <input class="ma2 ba w-100 pa3" name="title" type="text"/>
            <input class="ma2 ba w-100 pa3" name="content" type="text-area"/>
            <input type="submit" value="submit"
              class="f6 grow no-underline br-pill ba bw1 ph3 pv2 mb2 dib light-purple"/>
          </fieldset>
        </form>
      </main>
    </body>
  `
}
