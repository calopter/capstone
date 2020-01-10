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
        <nav class="bg-light-green pa3 pa4-ns">
          <a class="link dim mid-gray f6 f5-ns dib mr3"
            href="/hello">hello</a>
          <a class="link dim mid-gray f6 f5-ns dib mr3"
            href="/index">index</a>
          <a class="link dim mid-gray f6 f5-ns dib mr3"
            href="https://ddg.gg">external page</a>
          <a class="link dim mid-gray f6 f5-ns dib mr3"
            href="${url}">edit</a>
        </nav>
        <section class="mid-gray ma2 f5 lh-copy">
          ${child()}
        </section>
      </body>
    </html>
  `
}

const form = contents => {
  return `
    <form class="pa4 black-80" method="post">
      <div class="flex flex-wrap justify-center h-75">
        <textarea class="input-reset dib border-box ba
            b--black-20 pa2 br2 mb2 h-100 w-100"
          id="body" name="body">
        </textarea>
        <button class="f6 w-third h-2 grow br-pill ba bw1 ph3 pv2 mb2 db mid-gray"
          type="submit"/>submit</button>
        </div>
        <script>
          document.getElementById("body").value = "${contents}"
        </script>
    </form>
  `
}

module.exports = { template, form }
