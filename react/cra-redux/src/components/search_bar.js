import React, { Component } from "react";
import PropTypes from "prop-types";

// class component with all the functionality that React offers
// must have a render method
// class components have state
// always manipulate state with this.setState not this.state="123"
// controlled component input element component is set by state
// state is equal to an object

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = { term: "" };
  }
  render() {
    return (
      <div className="search-bar">
        <input
          value={this.state.term}
          onChange={event => this.onInputChange(event.target.value)}
        />
      </div>
    );
  }
  onInputChange(term) {
    this.setState({ term });
    this.props.onSearchTermChange(term);
  }
}

export default SearchBar;
