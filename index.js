const express = require('express')
const app = express()

const populationRoute = require('./routes/population')
const co2EmissionsRoute = require('./routes/co2-emissions')

app.use('/populations', populationRoute)
app.use('/emissions', co2EmissionsRoute)

const port = 3000
app.listen(port, () => console.log(`Example app listening on port ${port}!`))