const html = require('choo/html')

module.exports = props => {
  return html`
    <section class="mid-gray mh3 mv4 f5 lh-copy">
      ${props.links}
    </section>
  `
}
