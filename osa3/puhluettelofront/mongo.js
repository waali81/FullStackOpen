/* const mongoose = require('mongoose') */
import mongoose from 'mongoose'

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb://waalitimo_db_user:${password}@ac-tui3ahi-shard-00-00.k0bvop6.mongodb.net:27017,ac-tui3ahi-shard-00-01.k0bvop6.mongodb.net:27017,ac-tui3ahi-shard-00-02.k0bvop6.mongodb.net:27017/phonebookApp?ssl=true&replicaSet=atlas-6ys08k-shard-0&authSource=admin&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  // LISTAUS
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(person.name, person.number)
    })

    mongoose.connection.close()
  })

} else if (process.argv.length === 5) {
  // LISÄYS
  const person = new Person({
    name,
    number,
  })

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })

} else {
  console.log('Usage:')
  console.log('node mongo.js <password>')
  console.log('node mongo.js <password> "<name>" <number>')
  mongoose.connection.close()
}