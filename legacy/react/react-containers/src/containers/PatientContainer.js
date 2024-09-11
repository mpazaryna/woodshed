import React from 'react';
import Patient from '../components/Patient';

class PatientContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Joe Blow',
      age: '22'
    };
  }
  render() {
    return <Patient name={this.state.name} age={this.state.age} />;
  }
}

export default PatientContainer;
