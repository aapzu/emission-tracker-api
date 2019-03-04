const Datastore = require('nedb')
const config = require('../config')

const {
    emissionsDbPath,
    emissionsPcDbPath,
    populationsDbPath,
    countriesDbPath,
} = config

const emissionsDb = new Datastore({
    filename: emissionsDbPath,
    autoload: true,
})

const emissionsPcDb = new Datastore({
    filename: emissionsPcDbPath,
    autoload: true,
})

const populationsDb = new Datastore({
    filename: populationsDbPath,
    autoload: true,
})

const countriesDb = new Datastore({
    filename: countriesDbPath,
    autoload: true,
})

const reloadDb = (db) => new Promise((resolve) => {
    db.loadDatabase((err) => {
        if (err) {
            throw err
        }
        resolve()
    })
})

const reload = () => Promise.all([
    reloadDb(emissionsDb),
    reloadDb(emissionsPcDb),
    reloadDb(populationsDb),
    reloadDb(countriesDb),
])

module.exports = {
    emissionsDb,
    emissionsPcDb,
    populationsDb,
    countriesDb,
    reload,
}