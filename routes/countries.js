const express = require('express')
const db = require('../db')

const { countriesDb } = db

const router = express.Router()

router.get('/', (req, res) => {
    const { name, id, search } = req.query
    const query = {
        ...(search ? {
            name: {
                // The nedb "database" engine doesn't support smarter solutions for this.
                // In a real app with a real db this should be replaced with some non-regex alternative
                $regex: new RegExp(`^${search}`, 'i'),
            },
        } : {}),
        ...(name ? {
            name,
        } : {}),
        ...(id ? {
            id,
        } : {})
    }
    countriesDb.find(query).sort({
        name: 1
    }).exec((err, result) => {
        res.json(result)
    })
})

module.exports = router
