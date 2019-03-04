const express = require('express')
const cors = require('cors')
const cron = require('cron')
const downloadData = require('./utils/download-data')
const config = require('./config.json')

const { downloadDataCronPattern } = config

const app = express()

const populationRoute = require('./routes/population')
const co2EmissionsRoute = require('./routes/co2-emissions')
const countriesRoute = require('./routes/countries')

app.use(cors())

app.use('/populations', populationRoute)
app.use('/emissions', co2EmissionsRoute)
app.use('/countries', countriesRoute)

// Download the data when starting or once in a year
cron.job(downloadDataCronPattern, downloadData, null, true, null, null, true)

const port = 3000
app.listen(port, () => console.log(`Example app listening on port ${port}!`))