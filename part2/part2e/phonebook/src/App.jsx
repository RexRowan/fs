import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'
import Footer from './components/Footer'

const Filter = ({ searchTerm, onSearchTermChange }) => (
  <div>
    Search by name: <input
      value={searchTerm}
      onChange={(e) => onSearchTermChange(e.target.value)}
    />
  </div>
)

const PersonForm = ({ newName, newNumber, onNameChange, onNumberChange, onSubmit }) => (
  <form onSubmit={onSubmit}>
    <div>
      name: <input
        value={newName}
        onChange={(e) => onNameChange(e.target.value)}
      />
    </div>
    <div>
      number: <input
        value={newNumber}
        onChange={(e) => onNumberChange(e.target.value)}
      />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Persons = ({ persons, onDelete }) => (
  <ul>
    {persons.map((person) => (
      <li key={person.id}>
        {person.name}: {person.number}
        <button onClick={() => onDelete(person.id, person.name)}>delete</button>
      </li>
    ))}
  </ul>
)

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [notification, setNotification] = useState({ message: null, type: null })

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: null, type: null })
    }, 5000)
  }

  const addPerson = (event) => {
  event.preventDefault()

  const existingPerson = persons.find(p => p.name === newName)

  const personObject = {
    name: newName,
    number: newNumber,
  }

  if (existingPerson) {
    personService
      .update(existingPerson.id, personObject)
      .then(updatedPerson => {
        setPersons(persons.map(p => p.id !== existingPerson.id ? p : updatedPerson))
        setNewName('')
        setNewNumber('')
        showNotification(`Updated ${updatedPerson.name}`)
      })
      .catch(error => {
        showNotification(error.response.data.error, 'error')
      })
  } else {
    personService
      .create(personObject)
      .then(createdPerson => {
        setPersons(persons.concat(createdPerson))
        setNewName('')
        setNewNumber('')
        showNotification(`Added ${createdPerson.name}`)
      })
      .catch(error => {
        showNotification(error.response.data.error, 'error')
      })
  }
}

  const deletePerson = (id, name) => {
    const confirmDelete = window.confirm(`Delete ${name}?`)

    if (!confirmDelete) {
      return
    }

    personService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))
        showNotification(`Deleted ${name}`)
      })
      .catch(() => {
        showNotification(
          `Information of '${name}' has already been removed from server`,
          'error'
        )
        setPersons(persons.filter(person => person.id !== id))
      })
  }

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={notification.message} type={notification.type} />
      <Filter
        searchTerm={searchTerm}
        onSearchTermChange={(value) => setSearchTerm(value)}
      />
      <h3>Add a new</h3>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        onNameChange={(value) => setNewName(value)}
        onNumberChange={(value) => setNewNumber(value)}
        onSubmit={addPerson}
      />
      <h3>Numbers</h3>
      <Persons persons={filteredPersons} onDelete={deletePerson} />
        <Footer />
    </div>
  )
}

export default App