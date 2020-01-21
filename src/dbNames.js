const dbs = JSON.parse(localStorage.getItem('trieWiki/dbNames')) || {}

const getDb = key => {
  if (dbs[key]) return { key, name: dbs[key] }
}

const newDb = () => `trieWiki/${Date.now()}`

const updateDb = (key, name) => {
  dbs[key] = name
  localStorage.setItem('trieWiki/dbNames', JSON.stringify(dbs))
  localStorage.setItem('trieWiki/last', key)
}

module.exports = { getDb, newDb, updateDb }
