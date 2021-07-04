require('dotenv').config()
const express = require('express')
const { check } = require('express-validator')
const Airtable = require('airtable')
const fs = require('fs')
const { createJWT, verifyJWT } = require('./auth')
const cookieParser = require('cookie-parser')
const app = express()

Airtable.configure({
    apiKey: process.env.AIRTABLE_API_KEY
})

// const base = Airtable.base(process.env.AIRTABLE_BASE_NAME)
const base = require('airtable').base("Email Newsletter Signups")
const table = base(process.env.AIRTABLE_TABLE_NAME)

app.use(express.json())
app.use(express.static('public'))
app.use(cookieParser())

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

const initializedFile = './.data/initialized'

app.get('/admin', (req, res) => {
    if (fs.existsSync(initializedFile)) {
        // admin auth already initialized
        verifyJWT(req.cookies.token).then(decodedToken => {
            res.sendFile(__dirname + '/views/admin.html')
        }).catch(err => res.status(400).json({ message: 'Invalid auth token provided.'}))
    } else {
        // admin auth not initialized
        const token = createJWT({
            maxAge: 60 * 24 * 365 // 1 year 
        })

        fs.closeSync(fs.openSync('./.data/initialized', 'w'))

        res.cookie('token', token, { httpOnly: true, /*secure: true*/ })
        res.sendFile(__dirname + '/views/admin.html')
    }
})

app.get('/admin/reset', (req, res) => {
    try {
        if (fs.existsSync(initializedFile)) {
            verifyJWT(req.cookies.token).then(decodedToken => {
                fs.unlink(initializedFile, err => {
                    if (err) {
                        console.error('Error removing the file')
                        res.status(500).end()
                    }
                    res.send('Session ended')
                })
            }).catch(err => {
                res.status(400).json({message: 'Invalid auth token provided.'})
            })
        } else {
            res.status(500).json({message: 'No session started'})
        }
    } catch (err) {
        console.error(err)
    }
})

app.listen(3000, () => console.log('Server Ready'))