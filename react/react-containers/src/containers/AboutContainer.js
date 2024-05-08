import React from 'react';
import About from '../components/About';
import PoweredBy from '../components/Powered-by';
import { version } from '../../package.json';
import { author } from '../../package.json';

// Purpose: How things work (data fetching, state updates)
// Aware of flux: yes
// To read data: one option is to read from flux state
// To change data: Dispatch Redux actions

class AboutContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Containers & Components'
    };
  }
  render() {
    return (
      <div>
      <About name={this.state.name} author={author} version={version} />
      <PoweredBy />
      </div>
    );
  }
}

export default AboutContainer;
