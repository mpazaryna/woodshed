var React = require('react');
var AltContainer = require('alt/AltContainer');
var LocationStore = require('../stores/LocationStore');
var LocationActions = require('../actions/LocationActions');

var AllLocations = React.createClass({
  
  render() {
    if (this.props.errorMessage) {
      return (
        <div>{this.props.errorMessage}</div>
      );
    }
    if (LocationStore.isLoading()) {
      return (
        <div>
          <img src="ajax-loader.gif" />
        </div>
      )
    }
    return (
      <ul>
        {this.props.locations.map((location, i) => {
          return (
            <li key={i}>
              {location.name} {location.location}
            </li>
          );
        })}
      </ul>
    );
  }
});

var Locations = React.createClass({
  // Getting the state out of your store is simple, every alt store has a method which returns its state. 
  // The state is copied over as a value when returned so you accidentally don’t mutate it by reference. We can use React’s 
  // getInitialState to set the initial state using the store’s state.
  // 
  // But then we’ll want to listen to changes once the state in the store is updated. In your react component on 
  // componentDidMount you can add an event handler using LocationStore.listen.
  
  componentDidMount() {
    LocationStore.fetchLocations();
  },

  render() {
    return (
      <div>
        <h1>Locations</h1>
        <AltContainer store={LocationStore}>
          <AllLocations />
        </AltContainer>
      </div>
    );
  }
});

module.exports = Locations;