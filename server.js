require('dotenv').config()
const express = require('express')
const { check } = require('express-validator')
const Airtable = require('airtable')
const app = express()

Airtable.configure({
    apiKey: process.env.AIRTABLE_API_KEY
})

// const base = Airtable.base(process.env.AIRTABLE_BASE_NAME)
const base = require('airtable').base("Email Newsletter Signups")
const table = base(process.env.AIRTABLE_TABLE_NAME)

app.use(express.json())
app.use(express.static('public'))

app.get('/', (request, response) => {
    response.sendFile(__dirname + '/views/index.html')
})

app.post('/form', [
    check('name').isAlpha().isLength({ min: 3, max: 100 }),
    check('email').isEmail()
], (req, res) => {
    const name = req.body.name
    const email = req.body.email
    const date = (new Date()).toISOString()

    table.create({
        "Name": name,
        "Email": email,
        "Date": date
    }, (err, record) => {
        if (err) {
            console.error(err)
            return
        }
        console.log(record.getId())
    })

    res.end()
})

app.listen(3000, () => console.log('Server Ready'))