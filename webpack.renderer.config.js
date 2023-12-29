const rules = require('./webpack.rules');

rules.push({
  test: /\.css$/,
  use: [
    { loader: 'style-loader' },
    { loader: 'css-loader' }],
});

// // Sass rule... I guess.
// rules.push({
//   test: /\.sass$/,
//   use: [
//     { loader: "style-loader" },
//     { loader: "css-loader" },
//     { loader: "sass-loader" }
//   ]
// })

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules,
  },
};
