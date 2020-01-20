const html = require('choo/html')

module.exports = props => {
  return html`
    <section class="mid-gray mh3 mv4 f5 lh-copy">
      ${props.links}
      <label class="ph2">key:</label>
      <input class="w-100" value=${props.key}/>
    </section>
  `
}
