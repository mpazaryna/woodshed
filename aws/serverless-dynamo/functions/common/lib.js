/**
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Unary_plus
 *
 * unary plus is the fastest and preferred way of converting something into a number, because it does not
 * perform any other operations on the number. It can convert string representations of integers and floats,
 * as well as the non-string values true, false, and null. Integers in both decimal and hexadecimal
 * (0x-prefixed) formats are supported. Negative numbers are supported (though not for hex).
 * Using the operator on BigInt values throws a TypeError. If it cannot parse a particular value,
 * it will evaluate to NaN.
 */
function formInputDollar(z) {
  a = z.replace(/\,/g, '');
  a = +a;
  return a;
}

/**
 * The parseFloat() function parses an argument (converting it to a string first if needed)
 * and returns a floating point number.
 *
 * @param {*} z
 * @returns
 */
function formInputPercent(z) {
  return parseFloat(z);
}

// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
function docIdFromCode() {
  let doc_id = (Math.random() + 1).toString(36).substring(7);
  return doc_id;
}

// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
function makeid(length) {
  var result = '';
  var charactersUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var charactersLower = 'abcdefghijklmnopqrstuvwxyz0123456789';
  characters = charactersLower;
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// var idgen = require('idgen');

// function docIdFromLib() {
//   return idgen(8);
// }

function docId() {
  return makeid(5);
}

module.exports = { formInputDollar, formInputPercent, docId };
