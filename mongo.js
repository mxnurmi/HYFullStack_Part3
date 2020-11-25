const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
  }
  

const password = process.argv[2]

const url = 
    `mongodb+srv://fullstack3:${password}@cluster0.d8rmf.mongodb.net/part3-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })


const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    console.log("phonebook:")
    Person.find({}).then(results => {
        results.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close()
    })
} else {
    const name = process.argv[3]
    const number = process.argv[4]
    
    const person = new Person({
        name: name,
        number: number
    })
    
    person.save().then(response =>{
        console.log(`added ${name} ${number} to phonebook` )
        mongoose.connection.close()
    })
}

