const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.js',
    sw: './src/service-worker.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '.'),
  },
};
