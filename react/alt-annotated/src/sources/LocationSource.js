// One of the most common questions people have when they are new to flux is: where should async go?
// 
// There is no right answer right now and don’t feel bad if you’re putting it in actions or in stores. In this tutorial 
// we’ll be calling async from the actions.
//
// We can use something like fetch to fetch some data from a server, but for the purposes 
// of this tutorial we’ll just simulate an XHR with good ol' setTimeout and Promise so we copy fetch’s API.

var LocationActions = require('../actions/LocationActions');

var mockData = [
  { id: 0, name: 'Annapolis', location: 'MD' },
  { id: 1, name: 'Baltimore', location: 'MD' },
  { id: 2, name: 'Chicago', location: 'IL' },
  { id: 3, name: 'London', location: 'UK' },
  { id: 4, name: 'Miami', location: 'FL' },
  { id: 5, name: 'Paris', location: 'FR' },
  { id: 6, name: 'San Francisco', location: 'CA' }
];

// Next, we’ll need to change the actions to use this new method we created. We will add an action called fetchLocations which will fetch the 
// locations and then call updateLocations when it successfully completes. A new action is also added, locationsFailed which deals with 
// the locations not being available. Add these methods to the class.

var LocationSource = {
  fetchLocations() {
    return {
      remote() {
        return new Promise(function (resolve, reject) {
          // simulate an asynchronous flow where data is fetched on a remote server somewhere.
          setTimeout(function () {
            // change this to `false` to see the error action being handled.
            if (true) {
              // resolve with some mock data
              resolve(mockData);
            } else {
              reject('Things have broken');
            }
          }, 250);
        });
      },
      // Never check locally, always fetch remotely.
      local() {
        return null;
      },
      success: LocationActions.updateLocations,
      error: LocationActions.locationsFailed,
      loading: LocationActions.fetchLocations
    }
  }
};

module.exports = LocationSource;