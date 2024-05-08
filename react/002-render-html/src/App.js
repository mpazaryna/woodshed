import React, { Component } from 'react';
import ReactHtmlParser from 'react-html-parser';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      htmlToRender: '',
      loading: true,
      error: null
    };
  }

  componentDidMount() {
    axios.get(`api/devices`)
      .then(res => {
        const htmlToRender = res.data;
        console.log(res.data);
        this.setState({
          htmlToRender,
          loading: false,
          error: null
        });
      })
      .catch(err => {
        this.setState({
          loading: false,
          error: err
        });
      });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to ReactHtmlParser Sample</h2>
        </div>
        <p className="App-intro">
          <div>{ ReactHtmlParser(this.state.htmlToRender) }</div>
        </p>
      </div>
    );
  }
}

export default App;
