/* global AFRAME, THREE */

/**
 * Loads and setup ground model.
 */
AFRAME.registerComponent('log', {
  schema: {
    message: {type: 'string', default: 'Hello, World!'}
  },

  init: function () {
    console.log(this.data.message);
  }
});