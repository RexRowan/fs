import { useState } from 'react'

const History = (props) => {
    
    <div>
      button press history: {props.allClicks.join(' ')}
    </div>
  
}

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [allClicks, setAll] = useState([]) 

  const handleGoodClick = () => {
    setAll(allClicks.concat('G'))
    setGood(good + 1)
  }

  const handleNeutralClick = () => {
    setAll(allClicks.concat('N'))
    setNeutral(neutral + 1)
  }

  const handleBadClick = () => {
    setAll(allClicks.concat('B'))
    setBad(bad + 1)
  }

  return (
    <div>
      <h1>give feedback</h1>
      {good}
      <Button handleClick={handleGoodClick} text='good' />
      {neutral}
      <Button handleClick={handleNeutralClick} text='nautral' />
      {bad}
      <Button handleClick={handleBadClick} text='bad' />
      <History allClicks={allClicks} />
      <h1>statistics</h1>
    </div>
  )
}

export default App