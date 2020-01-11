const hyperdb = require('hyperdb')
const rai = require('random-access-idb')
const { Remarkable } = require('remarkable')

const db = hyperdb(rai('trieWiki'), {valueEncoding: 'utf-8'})
const md = new Remarkable()

const dbGet = (path, rejection) => {
  return new Promise((resolve, reject) => {
    db.get(path, (err, nodes) => {
      if (err) return reject(err)
      if (!nodes[0]) return reject(rejection)
      resolve(md.render(nodes[0].value))
    })
  })
}

const dbRead = path => {
  return new Promise(resolve => {
    db.get(path, (err, nodes) => {
      if (err) return resolve('')
      if (!nodes[0]) return resolve('')
      return resolve(nodes[0].value)
    })
  })
}

const dbSet = (key, val) => {
  return new Promise((resolve, reject) => {
    db.put(key, val, err => {
      if (err) return reject(err)
      resolve(val)
    })
  })
}

dbSet('/index', '[docs](/docs)')
dbSet('/docs', '[markdown syntax](/markdown)')
fetch('../doc/md-example.md')
  .then(resp => resp.text())
  .then(data => {
    dbSet('/markdown', data)
  })

module.exports = { dbGet, dbRead, dbSet, }
