import React from 'react';
import Say from '../components/say';

class SayContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      word: 'Lorem ipsom',
    };
  }
  render() {
    return <Say word={this.state.word} />;
  }
}

export default SayContainer;
