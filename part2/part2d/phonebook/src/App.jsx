import { useState, useEffect } from 'react';

const Filter = ({ searchTerm, onSearchTermChange }) => (
  <div>
    Search by name: <input
      value={searchTerm}
      onChange={(e) => onSearchTermChange(e.target.value)}
    />
  </div>
);

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
);

const Persons = ({ persons }) => (
  <ul>
    {persons.map((person, index) => (
      <li key={index}>
        {person.name}: {person.number}
      </li>
    ))}
  </ul>
);

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    console.log('effect');
    fetch('http://localhost:3001/persons')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('promise fulfilled');
        setPersons(data);
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();

    const personObject = {
      name: newName,
      number: newNumber
    };

    // Check if the new name already exists in the array
    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook.`);
    } else {
      setPersons(persons.concat(personObject));
      setNewName('');
      setNewNumber('');
    }
  };

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <Persons persons={filteredPersons} />
    </div>
  );
};

export default App;