import React, { Component } from 'react';
import HelpPage from './help';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to ReactHtmlParser Sample</h2>
        </div>
        <div className="App-intro">
          <HelpPage/>
        </div>
      </div>
    );
  }
}

export default App;
