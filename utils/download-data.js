const http = require('http')
const fs = require('fs')
const unzip = require('unzip')
const Datastore = require('nedb')
const getStream = require('get-stream')
const promisify = require('util').promisify
const parseString = require('xml2js').parseString

const CO2_DB_PATH = 'co2_emissions.db'
const POPULATION_DB_PATH = 'populations.db'

// TODO: Don't remove the files before the new ones have been written

if (fs.existsSync(CO2_DB_PATH)) {
    fs.unlinkSync(CO2_DB_PATH)
}

if (fs.existsSync(POPULATION_DB_PATH)) {
    fs.unlinkSync(POPULATION_DB_PATH)
}

const co2Db = new Datastore({
    filename: CO2_DB_PATH,
    autoload: true
})

const populationDb = new Datastore({
    filename: POPULATION_DB_PATH,
    autoload: true
})

http.get('http://api.worldbank.org/v2/en/indicator/EN.ATM.CO2E.KT?downloadformat=xml', async (response) => {
    const xmlString = await new Promise((resolve) => {
        response
            .pipe(unzip.Parse())
            .on('entry', (res) => getStream(res).then(resolve))
    })
    const result = await promisify(parseString)(xmlString)
    const records = result.Root.data[0].record.map(({ field }) => ({
        countryKey: field[0].$.key,
        countryName: field[0]._,
        year: field[2]._,
        value: field[3]._,
    }))
    co2Db.insert(records, () => {
        console.log('CO2 emission data updated')
    })
})

http.get('http://api.worldbank.org/v2/en/indicator/SP.POP.TOTL?downloadformat=xml', async (response) => {
    const xmlString = await new Promise((resolve) => {
        response
            .pipe(unzip.Parse())
            .on('entry', (res) => getStream(res).then(resolve))
    })
    const result = await promisify(parseString)(xmlString)
    const records = result.Root.data[0].record.map(({ field }) => ({
        countryKey: field[0].$.key,
        countryName: field[0]._,
        year: field[2]._,
        value: field[3]._,
    }))
    // Couldn't promisify insert but letting it be for now
    populationDb.insert(records, () => {
        console.log('Population data updated')
    })
})
