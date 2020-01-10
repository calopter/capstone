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

const form = (url, contents) => {
  return `
    <section>
      <header class="flex justify-between ph2 mh3 ba b--black-20">
        <p class="pv2 ml3 h-75">
          editing page:
          <a class="link" href=${url.pathname}>
            ${url.pathname.slice(1)}
          </a>
        </p>
        <button class="f6 w-third h-75 grow br-pill ba bw1
          ph3 pv2 ma3 bg-washed-green dim mid-gray"
          type="submit"
          form="content"/>submit</button>
        </header>
      <form class="pt2 black-80" id="content" method="post">
        <div class="flex flex-wrap justify-center h-75">
          <textarea class="bg-washed-green input-reset dib border-box ba
              b--black-20 pa2 br2 h-100 w-100"
            id="body" name="body" autofocus>
          </textarea>
        </div>
        <script>
          document.getElementById("body").value = "${contents}"
        </script>
      </form>
    <section>
  `
}

module.exports = { template, form }
