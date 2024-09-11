import React from 'react';
import About from '../components/About';

// Purpose: How things work (data fetching, state updates)
// Aware of flux: yes
// To read data: one option is to read from flux state
// To change data: Dispatch Redux actions

class AboutContainerStatic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Containers & Components',
      author: 'Test',
      version: '1.0'
    };
  }
  render() {
    return (
      <div>
        <About name={this.state.name} author={this.state.author} version={this.state.version} />
      </div>
    );
  }
}

export default AboutContainerStatic;
