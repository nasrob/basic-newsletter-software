require('dotenv').config()
const express = require('express')
const app = express()

const Airtable = require('airtable')

app.use(express.json())
app.use(express.static('public'))

Airtable.configure({
    apiKey: process.env.AIRTABLE_API_KEY
})

const base = Airtable.base(process.env.AIRTABLE_BASE_NAME)
const table = base(process.env.AIRTABLE_TABLE_NAME)

app.get('/', (request, response) => {
    response.sendFile(__dirname + '/views/index.html')
})

app.post('/form', (req, res) => {
    console.log(req.body.name)
    console.log(req.body.email)

    res.end()
})

app.listen(3000, () => console.log('Server Ready'))