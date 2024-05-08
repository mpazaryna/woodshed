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

function stripComma(z) {
  a = z.replace(/\,/g, "");
  a = +a;
  return a;
}

module.exports = stripComma;
