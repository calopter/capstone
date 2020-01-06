const hyperdb = require('hyperdb')
const rai = require('random-access-idb')

const db = hyperdb(rai('./my.db'), {valueEncoding: 'utf-8'})

const fetch = async path => {
  return new Promise((resolve, reject) => {
    db.get(path, (err, nodes) => {
      if (err) return reject(err)
      if (!nodes[0]) return reject('path not found')
      resolve(nodes[0].value)
    })
  })
}

const put = async (key, val) => {
  return new Promise((resolve, reject) => {
    db.put(key, val, err => {
      if (err) return reject(err)
      resolve(`stored to ${key}`)
    })
  })
}

module.exports = (state, emitter) => {
  state.body = 'hello'

  emitter.on('refresh', () => {
    fetch('/hello').then(data => {
      state.body = data
      emitter.emit('render')
    }).catch(console.log)
  })

  emitter.on('stamp', time => {
    put('/hello', time).then(console.log).catch(console.log)
    state.body = time
    emitter.emit('render')
  })

  emitter.on('content-submitted', ({ title, content }) => {
    put(title, content)
    state.body = `${title}\n\n${content}`
    emitter.emit('render')
  })

  emitter.on('lookup', title => {
    fetch(title).then(data => {
      state.body = `${title}\n\n${data}`
      emitter.emit('render')
    }).catch(console.log)
  })
}
