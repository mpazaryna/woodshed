// We’ll be creating an instance of alt, this instantiates a Flux dispatcher for you and gives 
// you methods to create your actions and stores. We’ll be referring back to this file 
// throughout this guide.

var Alt = require('alt');
var alt = new Alt();
var chromeDebug = require('alt/utils/chromeDebug')

chromeDebug(alt);

module.exports = alt;