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

app.get('/api/persons', (req, res, next) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
    .catch(error => next(error))
})

app.get('/info', (req, res, next) => {
    const date = Date()

    Person.count({}).then(peopleAmount => {
        res.send(`<p>phonebook has info for ${peopleAmount} people</p> <p>${date}</p>`)
    })
    .catch(error => next(error))

    // res.send(`<p>phonebook has info for ${persons.length} people</p> <p>${date}</p>`)
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person)
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))

    // const id = Number(req.params.id)
    // const note = persons.find(person => person.id === id)

    // if (note) {
    //     res.json(note)
    // } else {
    //     res.status(404).end()
    // }
})

app.delete('/api/persons/:id', (req, res, next) => {

    Person.findByIdAndRemove(req.params.id)
    .then(result => {
        res.status(204).end()
    })
    .catch(error => next(error))
    // const id = Number(req.params.id)
    // persons = persons.filter(person => person.id !== id)

    // res.status(204).end()
})

app.post('/api/persons', (req, res, next) => {
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
    .catch(error => next(error))

    // persons = persons.concat(person)
    // res.json(person)
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(error => next(error))
})

const errorHandler = (error, req, res, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return res.status(400).sens({ error: 'malformatted id'})
    }
    next(error)
}

app.use(errorHandler)

morgan.token('post', (req) => {
    request = JSON.stringify(req.body)
    if (request === '{}') {
        return ' '
    }

    return JSON.stringify(req.body)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    date = Date()
    console.log(`Server ok at time: ${date}`)
})