"use strict";

import React    from 'react';
import List     from './list';
import Message  from './message';

class Api extends React.Component {
  constructor(props) {
    super(props)
    this.state = { questions: [] }
  }
  componentWillMount() {
    fetch('http://private-272e4-reactexplore.apiary-mock.com/questions')
      .then((response) => {
        return response.json()
      })
      .then((questions) => {
        this.setState({ questions: questions })
      })
  }
  render() {
    if (this.state.questions.length > 1) {
      return (
        <div className="container-fluid">
          <List listado={this.state.questions} />
        </div>
      );
    } else {
      return (
        <div className="container-fluid">
          <Message />
        </div>
      );
    }
  }
}

export default Api;
