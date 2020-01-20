const html = require('choo/html')

module.exports = (props, emit) => {
  const { path, editing, peers } = props
  
  const view = html`
    <nav class="flex justify-between mid-gray bg-light-green">
      <a class="link dim f6 f5-ns dib mv4 ml3 mr4"
        onclick=${() => emit('index')}>index</a>
      <a class="link dim f6 f5-ns dib mv4"
        href="/${path}?edit=true">edit</a>
      <p class="dim f6 mr3 dib mv4">
        ${peers ? 'peers:  ' : ''}
        ${peers}
      </p> 
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
