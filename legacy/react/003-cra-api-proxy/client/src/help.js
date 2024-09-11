import React, { Component } from 'react';
import ReactHtmlParser from 'react-html-parser';
import axios from 'axios';

class Help extends Component {
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
      <div className="help">
        <div>{ ReactHtmlParser(this.state.htmlToRender) }</div>
      </div>
    );
  }
}

export default Help;
