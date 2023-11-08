import { useState } from 'react'

const Statistics = ({good, neutral, bad}) => {
  const total = good + neutral + bad;
  const average = total !== 0 ? (good - bad) / total : 0;
  const positivePercentage = total !== 0 ? (good / total) * 100 : 0;

  if (total === 0) {
    return (
      <div>
        <h1>statistics</h1>
        <p>No feedback given</p>
      </div>
    );
  }

  return (
    <div>
      <h1>statistics</h1>
      <p>good: {good}</p>
      <p>neutral: {neutral}</p>
      <p>bad: {bad}</p>
      <p>all: {total}</p>
      <p>average: {average.toFixed(2)}</p>
      <p>positive: {positivePercentage.toFixed(2)}%</p>
    </div>
  );
};

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
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App