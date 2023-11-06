const App = () => {
  // const-definitions
  const course = 'Half Stack application development'
  const parts = [
    { part: 'Fundamentals of React', exercise: 10 },
    { part: 'Using props to pass data', exercise: 7 },
    { part: 'State of a component', exercise: 14 },
  ]

  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  )
}

const Header = ({ course }) => {
  return (
    <div>
      <h1>{course}</h1>
    </div>
  );
};

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map((item, index) => (
        <p key={index}>
          {item.part} {item.exercise}
        </p>
      ))}
    </div>
  );
};

const Total = ({ parts }) => {
  const total = parts.reduce((sum, item) => sum + item.exercise, 0);
  return (
    <div>
      <p>Number of exercises {total}</p>
    </div>
  );
};

export default App