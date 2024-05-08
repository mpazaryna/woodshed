# Functional Components

Literature Notes: 
https://www.freecodecamp.org/news/react-components-jsx-props-for-beginners/

The first and recommended component type in React is functional components. A functional component is basically a JavaScript/ES6 function that returns a React element (JSX). According to React's official docs, the function below is a valid functional component

```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

Alternatively, you can also create a functional component with the arrow function definition:

```jsx
const Welcome = (props) => { 
  return <h1>Hello, {props.name}</h1>; 
}
```

This function is a valid React component because it accepts a single “props” (which stands for properties) object argument with data and returns a React element. — [**reactjs.org**](https://reactjs.org/)

To be able to use a component later, you need to first export it so you can import it somewhere else:

```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

export default Welcome;
```

tags: #react
