import React from 'react';

const Patient = ({ name, age }) => (
  <div className="patient">
    <h2>Patient: {name} </h2>
    <h3>Age: {age} </h3>
  </div>
);

Patient.propTypes = {
  name: React.PropTypes.string.isRequired,
  age: React.PropTypes.string.isRequired
};

export default Patient;
