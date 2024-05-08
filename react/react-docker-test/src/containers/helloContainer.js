import React from 'react';
import Hello from '../components/hello';

class HelloContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Containers & Components'
    };
  }
  render() {
    return (
      <div>
        <Hello name={this.state.name} />
      </div>
    );
  }
}

export default HelloContainer;
