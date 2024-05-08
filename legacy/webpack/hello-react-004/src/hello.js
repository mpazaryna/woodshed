import React from 'react';
import ReactDOM from 'react-dom';

class Hello extends React.Component {
  render() {
    return <h1>Hello as js file moved and its hot.</h1>
  }
}

ReactDOM.render(<Hello/>, document.getElementById('hello'));
