const html = require('choo/html')

module.exports = (props, emit) => {
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
