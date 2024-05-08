var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    app: ["./src/main.js"]
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  output: {
    filename: "bundle.js",
    path: __dirname + "/dist",
  },
};
