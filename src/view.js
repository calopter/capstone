const form = contents => {
  return `<form method="post">
     <label for="body">body:</label>
     <input class="db ma3"
       id="body" name="body"
       type="text-area"
       value="${contents}"/>
     <input type="submit" value="submit"/>
  </form>`
}

module.exports = { form }
