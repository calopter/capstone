const template = (url, child) => {
  url = url.toString()
  if (!url.match(/\?edit=true/)) url += '?edit=true'
  return `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="manifest" href="manifest.webmanifest">
        <link rel="stylesheet" type="text/css" href="src/tachyons.min.css">
      </head>
      <body class="bg-washed-green">
        <nav class="bg-light-green">
        <a class="link dim mid-gray f6 f5-ns dib mv4 ml3 mr4"
            href="/index">index</a>
          <a class="link dim mid-gray f6 f5-ns dib mv4"
            href="${url}">edit</a>
        </nav>
        <section class="mid-gray mh3 mv4 f5 lh-copy">
          ${child()}
        </section>
      </body>
    </html>
  `
}

const form = (url, contents) => {
  return `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="manifest" href="manifest.webmanifest">
        <link rel="stylesheet" type="text/css" href="src/tachyons.min.css">
      </head>
      <body class="bg-washed-green">
        <nav class="flex justify-between bg-light-green mid-gray mw-100">
          <a class="link dim mid-gray f6 f5-ns dib mv4 ml3"
              href="/index">index</a>
          <p class="f6 mv4">
            editing: <a class="link" href=${url.pathname}>
              ${url.pathname.slice(1)}
            </a>
          </p>
          <div class="flex flex-column justify-around w-25 mr3 min-h-100">
            <button class="f6 w-100 border-box grow br-pill ba bw1
              ph3 pv2 h-50 mr4-ns bg-washed-green dim mid-gray"
              type="submit"
              form="content"/>
                submit
            </button>
          </div>
        </nav>
        <section>
          <form class="pt3 black-80" id="content" method="post">
            <input type="file" id="file"/>
            <div class="flex flex-wrap justify-center h-75">
              <textarea class="bg-washed-green input-reset dib
                border-box ba b--black-20 pa2 br2 mh2 h-100 w-100"
                id="body" name="body" autofocus>${contents}</textarea>
            </div>
            <script>
const fileInput = document.getElementById('file')
fileInput.addEventListener('change', () => {
  const file = fileInput.files[0]
  const md = "\\n\\n![" + file.name + "](" + file.name + ")"
  document.getElementById('body').value += md 
  navigator.serviceWorker.controller.postMessage(file)
})
            </script>
         </form>
        <section>
      </body>
    </html>
  `
}

module.exports = { template, form }
