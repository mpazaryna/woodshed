import React from 'react';
import Subjective from '../components/Subjective';

class SubjectiveContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Joe Blow',
      age: '22'
    };
  }
  render() {
    return <Subjective name={this.state.name} age={this.state.age} />;
  }
}

export default SubjectiveContainer;
