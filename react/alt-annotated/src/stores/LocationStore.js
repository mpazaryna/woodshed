// The store is your data warehouse. This is the single source of truth for a particular piece of your application’s state. 
// Similar to actions, we’ll be creating a class for the store. Also like the actions, the class syntax is completely 
// optional, you can use regular constructors and prototypes.

var alt = require('../alt');
var LocationActions = require('../actions/LocationActions');
var LocationSource = require('../sources/LocationSource');

class LocationStore {
  constructor() {
    
    // Instance variables defined anywhere in the store will become the state. This resembles how we reason about and 
    // build normal JS classes. You can initiaize these in the constructor and then update them directly 
    // in the prototype methods.
    
    this.locations = [];
    this.errorMessage = null;

    // And then in the constructor, we bind our action handlers to our actions.
    // Next we’ll update our store to handle these new actions. It’s just a matter of adding the new actions and their handlers to bindListeners. 
    // We’ll be adding a new piece of state though, ‘errorMessage’ to deal with any potential error messages.
    
    this.bindListeners({
      handleUpdateLocations: LocationActions.UPDATE_LOCATIONS,
      handleFetchLocations: LocationActions.FETCH_LOCATIONS,
      handleLocationsFailed: LocationActions.LOCATIONS_FAILED,
    });

    this.exportPublicMethods({
      getLocation: this.getLocation
    });

    this.exportAsync(LocationSource);
  }

  // Next, we define methods in the store’s prototype that will deal with the actions. These are called action handlers.
  // Stores automatically emit a change event when an action is dispatched through the store and the action handler ends. In order to 
  // suppress the change event you can return false from the action handler.
  
  handleUpdateLocations(locations) {
    this.locations = locations;
    this.errorMessage = null;
  }

  handleFetchLocations() {
    this.locations = [];
  }

  handleLocationsFailed(errorMessage) {
    this.errorMessage = errorMessage;
  }

  getLocation(id) {
    var { locations } = this.getState();
    for (var i = 0; i < locations.length; i += 1) {
      if (locations[i].id === id) {
        return locations[i];
      }
    }
    return null;
  }
}

module.exports = alt.createStore(LocationStore, 'LocationStore');