import React from 'react';

const Subjective = ({ name, age }) => (
  <div className="subjective">
    <h2>Subjective: {name} </h2>
    <h3>Age: {age} </h3>
  </div>
);

Subjective.propTypes = {
  name: React.PropTypes.string.isRequired,
  age: React.PropTypes.string.isRequired
};

export default Subjective;
