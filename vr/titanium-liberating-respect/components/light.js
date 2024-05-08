/* global AFRAME, THREE */

AFRAME.registerComponent("lightbar", {
  schema: {
    color: { type: "color", default: "#AAA" }
  },

  /**
   * Initial creation and setting of the mesh.
   */
  init: function() {
    var data = this.data;
    var el = this.el;
    var geometry = new THREE.SphereGeometry(0.2, 32, 20);
    var material = new THREE.MeshBasicMaterial({ color: data.color });
    var sphere = new THREE.Mesh(geometry, material);
    el.setObject3D("lightbar", sphere);
  }
});
