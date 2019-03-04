const express = require('express')
const db = require('../db')

const { emissionsDb, emissionsPcDb } = db

const router = express.Router()

router.get('/', (req, res) => {
    const { country, year, perCapita } = req.query
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
    const db = perCapita ? emissionsPcDb : emissionsDb
    db.find(query, (err, result) => {
        res.json(result)
    })
})

module.exports = router
