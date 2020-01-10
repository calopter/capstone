const hyperdb = require('hyperdb')
const rai = require('random-access-idb')

const db = hyperdb(rai('trieWiki'), {valueEncoding: 'utf-8'})

const dbGet = (path, rejection) => {
  return new Promise((resolve, reject) => {
    db.get(path, (err, nodes) => {
      if (err) return reject(err)
      if (!nodes[0]) return reject(rejection)
      resolve(nodes[0].value)
    })
  })
}

const dbRead = path => {
  return new Promise(resolve => {
    db.get(path, (err, nodes) => {
      if (err) return resolve(null)
      if (!nodes[0]) return resolve(null)
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

module.exports = { dbGet, dbRead, dbSet, }
