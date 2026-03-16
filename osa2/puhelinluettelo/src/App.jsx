import { useState, useEffect } from 'react'
import personService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()

    const alreadyAddedPerson = persons.find(p => p.name === newName)

    if (alreadyAddedPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook. Replace the old number with a new one?`
      )
      if (confirmUpdate) {
        const updatedPerson = { ...alreadyAddedPerson, number: newNumber }

        personService
          .update(alreadyAddedPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== alreadyAddedPerson.id ? p : returnedPerson))
            setNotification({
              message: `Updated number for ${returnedPerson.name}`,
              type: 'success'
            })
            setTimeout(() => {
              setNotification(null)
            }, 5000)
            setNewName('')
            setNewNumber('')
          })
      }
      return
    }

    const personObject = { name: newName, number: newNumber }

    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNotification({
          message: `Added ${returnedPerson.name}`,
          type: 'success'
        })
        setTimeout(() => {
        setNotification(null)
        }, 5000)
        setNewName('')
        setNewNumber('')
      })

  }

  const handleDelete = (id, name) => {
    const confirmDelete = window.confirm(`Delete ${name}?`)

    if (confirmDelete) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          setNotification({
            message: `Deleted ${name}`,
            type: 'success'
          })
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        })
        .catch(error => {
          setNotification({
            message: `Information of ${name} has already been removed from server`,
            type: 'error'
          })
          setTimeout(() => setNotification(null), 5000)
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setFilter(event.target.value)

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().startsWith(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={notification} />

      <Filter
        filter={filter}
        handleFilterChange={handleFilterChange}
      />

      <h2>Add a new</h2>

      <PersonForm
        handleSubmit={handleSubmit}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>

      <Persons
      persons={personsToShow}
      handleDelete={handleDelete}
      />

    </div>
  )

}

export default App
