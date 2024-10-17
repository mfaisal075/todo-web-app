const path = require('path');

module.exports = {
  entry: './index.js', // or your entry file
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      'react-native$': 'react-native-web',
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/, // Handle JS, JSX, TS, and TSX files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-flow',
              '@babel/preset-typescript'
            ],
          },
        },
      },
      {
        test: /\.(png|jpg|gif|svg)$/, // Handle image files
        use: ['file-loader'],
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/, // Handle font files
        use: ['file-loader'],
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8080,
  },
};
