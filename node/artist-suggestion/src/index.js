var uniqueRandomArray = require('unique-random-array')
var artistNames = require('./artist-names.json');

module.exports = {
  all: artistNames,
  random: uniqueRandomArray(artistNames),
  calc: calc,
  adder: adder,
  calcEquity: calcEquity
};

function random(number) {
  if (number === undefined) {
    return getRandomItem();
  } else {
    var randomItems = [];
    for (var i = 0; i < number; i++) {
      randomItems.push(getRandomItem());
    }
    return randomItems;
  }
}

function calc(x,y) {
  return x + y;
}

function adder(x,y) {
  return x + y;
}


function calcEquity(x,y,z) {
  return ((x + y) * z);
}
