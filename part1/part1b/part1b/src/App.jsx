const App = () => {
  const course = 'Half Stack application development';
  const part = [
    {
      name: 'Fundamentals of React',
      exercises: 10
    },
    {
      name: 'Using props to pass data',
      exercises: 7
    },
    {
      name: 'State of a component',
      exercises: 14
    },
  ];

  return (
    <div>
      <Header course={course} />
      <Content part={part} />
      <Total part={part} />
    </div>
  )
};

const Header = ({ course }) => {
  return (
    <div>
      <h1>{course}</h1>
    </div>
  );
};

const Content = ({ part }) => {
  return (
    <div>
      {part.map((item, index) => (
        <p key={index}>
          {item.name} {item.exercises}
        </p>
      ))}
    </div>
  );
};

const Total = ({ part }) => {
  const total = part.reduce((sum, item) => sum + item.exercises, 0);
  return (
    <div>
      <p>Number of exercises {total}</p>
    </div>
  );
};

export default App;
