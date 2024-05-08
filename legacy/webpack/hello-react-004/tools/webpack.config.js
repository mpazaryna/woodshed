var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    app: ["../src/main.js"]
  },
  module: {
    loaders: [
      {test: /\.js$/, include: path.join(__dirname, 'src'), loaders: ['babel']}
    ]
  },
  output: {
    filename: "bundle.js",
    path: __dirname + "../../dist",
  },
};
