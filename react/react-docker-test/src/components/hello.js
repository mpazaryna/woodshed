import React from 'react';
import './hello.css';

const HelloWorld = (props) => (
  <div className="hello">
    <h1>Hello, {props.name}!</h1>
  </div>
)

HelloWorld.propTypes = {
  name: React.PropTypes.string.isRequired
}

export default HelloWorld;
