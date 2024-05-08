module.exports = convert

function convert(hex) {
  var convertHex = require("convert-hex")
  return (convertHex.hexToBytes(hex).join('.')) 
}
