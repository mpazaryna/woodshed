import React from "react";
import axios from "axios";
import Paper from "material-ui/Paper";

export default class PersonList extends React.Component {
  state = {
    persons: []
  };

  componentDidMount() {
    axios.get(`https://jsonplaceholder.typicode.com/users`).then(res => {
      const persons = res.data;
      this.setState({ persons });
    });
  }

  render() {
    return (
      <Paper>
        <ul>{this.state.persons.map(person => <li>{person.name}</li>)}</ul>
      </Paper>
    );
  }
}
