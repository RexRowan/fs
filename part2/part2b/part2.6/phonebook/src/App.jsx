import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 

  const [newName, setNewName] = useState('')

  const addPerson = (event) => {
    event.preventDefault(); 

    const personObject = {
      name: newName
    };

// Check if the new name already exists in the array
if (persons.some(person => person.name === newName)) {
  alert(`${newName} is already added to the phonebook.`);
} else {
  setPersons(persons.concat(personObject));
  setNewName('');
}
};

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      ...
    </div>
  )
}

export default App