const express = require('express')
const db = require('../db')

const { populationsDb } = db

const router = express.Router()

router.get('/', (req, res) => {
    const { country, year } = req.query
    const query = {
        ...(country ? {
            $or: [{
                countryName: country,
            }, {
                countryKey: country,
            }]
        } : {}),
        ...(year ? {
            year,
        } : {})
    }
    populationsDb.find(query, (err, result) => {
        res.json(result)
    })
})

module.exports = router
