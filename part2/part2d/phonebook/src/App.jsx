import { useState, useEffect } from 'react'
import personService from './services/persons'

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

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(person => person.name === newName)

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )

      if (!confirmUpdate) {
        return
      }

      const changedPerson = { ...existingPerson, number: newNumber }

      personService
        .update(existingPerson.id, changedPerson)
        .then(returnedPerson => {
          setPersons(persons.map(person =>
            person.id !== existingPerson.id ? person : returnedPerson
          ))
          setNewName('')
          setNewNumber('')
        })
        .catch(() => {
          alert(`the person '${newName}' was already removed from server`)
          setPersons(persons.filter(person => person.id !== existingPerson.id))
        })

      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
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
      })
      .catch(() => {
        alert(`the person '${name}' was already removed from server`)
        setPersons(persons.filter(person => person.id !== id))
      })
  }

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
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
    </div>
  )
}

export default App