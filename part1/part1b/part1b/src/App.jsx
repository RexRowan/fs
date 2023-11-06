const App = () => {
  const course = 'Half Stack application development';
  const contentData = [
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
      <Content contentData={contentData} />
      <Total contentData={contentData} />
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

const Content = ({ contentData }) => {
  return (
    <div>
      {contentData.map((item, index) => (
        <p key={index}>
          {item.name} {item.exercises}
        </p>
      ))}
    </div>
  );
};

const Total = ({ contentData }) => {
  const total = contentData.reduce((sum, item) => sum + item.exercises, 0);
  return (
    <div>
      <p>Number of exercises {total}</p>
    </div>
  );
};

export default App;
