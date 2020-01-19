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
      <section>
        <form class="pt1 black-80" id="content" onsubmit=${onSubmit}>
          <div class="flex flex-wrap justify-center">
            <label for="key">key:</label>
            <input
              type="text"
              id="key" name="key"
              value="${state.key}"/>
          </div>
          <button type="submit">enter</button>
        </form>
      </section>
    </body>
  `
}
