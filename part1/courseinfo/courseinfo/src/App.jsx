const App = () => {
  // const-definitions
  const course = 'Half Stack application development'
  const contentData = [
    { part: 'Fundamentals of React', exercise: 10 },
    { part: 'Using props to pass data', exercise: 7 },
    { part: 'State of a component', exercise: 14 },
  ]

  return (
    <div>
      <Header course={course} />
      <Content contentData={contentData} />
      <Total contentData={contentData} />
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

const Content = ({ contentData }) => {
  return (
    <div>
      {contentData.map((item, index) => (
        <p key={index}>
          {item.part} {item.exercise}
        </p>
      ))}
    </div>
  );
};

const Total = ({ contentData }) => {
  const total = contentData.reduce((sum, item) => sum + item.exercise, 0);
  return (
    <div>
      <p>Number of exercises {total}</p>
    </div>
  );
};

export default App