const http = require('http')
const axios = require('axios')
const unzip = require('unzip')
const getStream = require('get-stream')
const promisify = require('util').promisify
const parseString = require('xml2js').parseString
const config = require('../config')
const db = require('../db')

const {
    emissionsDb,
    emissionsPcDb,
    populationsDb,
    countriesDb,
} = db

const {
    emissionsApiUrl,
    emissionsPcApiUrl,
    populationsApiUrl,
    countriesApiUrl,
} = config

const emptyDb = (db) => new Promise((resolve) => {
    db.remove({}, {
        multi: true
    }, (err) => {
        if (err) {
            throw err
        }
        db.loadDatabase(function (err) {
            if (err) {
                throw err
            }
            resolve()
        })
    })
})

// This abstraction is only possible 'cause the schemas are the same
const download = (url, db) => new Promise((resolve) => {
    http.get(url, async (response) => {
        const xmlString = await new Promise((resolve) => {
            response
                .pipe(unzip.Parse())
                .on('entry', (res) => getStream(res).then(resolve))
        })
        const result = await promisify(parseString)(xmlString)
        const records = result.Root.data[0].record.map(({field}) => ({
            countryKey: field[0].$.key,
            countryName: field[0]._,
            year: field[2]._,
            value: field[3]._,
        }))
        await emptyDb(db)
        db.insert(records, () => resolve())
    })
})

const updateCountries = async (url) => {
    // Making only one request since I trust that the amount of countries
    // (currently 304) will not bypass 500 in the near future
    const { data } = await axios.get(url)
    const [, countries] = data
    await emptyDb(countriesDb)
    return new Promise((resolve) => {
        countriesDb.insert(countries, () => resolve())
    })
}

module.exports = function () {
    download(emissionsApiUrl, emissionsDb)
        .then(() => console.log('CO2 emission data updated'))
        .catch((e) => console.error('CO2 emission data update failed: ' + e))

    download(emissionsPcApiUrl, emissionsPcDb)
        .then(() => console.log('CO2 emission data per capita updated'))
        .catch((e) => console.error('CO2 emission data per capita update failed: ' + e))

    download(populationsApiUrl, populationsDb)
        .then(() => console.log('Population data updated'))
        .catch((e) => console.error('Population data update failed: ' + e))

    updateCountries(countriesApiUrl)
        .then(() => console.log('Countries updated'))
        .catch((e) => console.error('Countries update failed: ' + e))
}


