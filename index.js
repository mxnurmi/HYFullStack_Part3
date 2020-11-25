require('dotenv').config()
const { response } = require('express')
const express = require('express')
var morgan = require('morgan')
const app = express()
const Person = require('./models/person')

app.use(express.json()) 
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'))

app.use(express.static('build'))

let persons = [
    {
        name: "Arto Hellas",
        number: "040-1233456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "34-44-505050",
        id: 2
    },
    {
        name: "Dan Abramov",
        number: "12-34-233434",
        id: 3
    },
    {
        name: "Mary Testipersoona",
        number: "112",
        id: 5
    }
]

// app.get('/api/persons', (req, res) => {
//     res.json(persons)
// })

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

app.get('/info', (req, res) => {
    const date = Date()
    res.send(`<p>phonebook has info for ${persons.length} people</p> <p>${date}</p>`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const note = persons.find(person => person.id === id)

    if (note) {
        res.json(note)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    // const randId = Math.floor(Math.random() * 100000)
    const body = req.body

    // if (!body.name || !body.number) {
    //     return res.status(400).json({
    //          error: 'name or number is missing' 
    //     })
    // }

    // if (persons.find(person => person.name === body.name)) {
    //     return res.status(400).json({
    //         error: 'name must be unique' 
    //    })
    // }

    if (body.name === undefined) {
        return res.status(400).json({ error: 'name missing' })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
        //id: randId
    })

    person.save().then(savedPerson => {
        res.json(savedPerson)
    })

    // persons = persons.concat(person)
    // res.json(person)
})

morgan.token('post', (req) => {
    request = JSON.stringify(req.body)
    if (request === '{}') {
        return ' '
    }

    return JSON.stringify(req.body)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log('server ok')
})