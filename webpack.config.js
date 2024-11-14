const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './server.js', // Set your main entry point
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  mode: 'production', // or 'production' for production builds
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.html$/,
        use: ['html-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // Generate HTML file
      filename: 'index.html',
    }),
    // Add more HtmlWebpackPlugin instances for other HTML files
    new HtmlWebpackPlugin({
      template: './public/dashboard.html',
      filename: 'dashboard.html',
    }),
    new HtmlWebpackPlugin({
      template: './public/pump.html',
      filename: 'pump.html',
    }),
    new HtmlWebpackPlugin({
        template: './public/raydium.html',
        filename: 'raydium.html',
      }),

      new HtmlWebpackPlugin({
        template: './public/trades.html',
        filename: 'trades.html',
      }),

      new HtmlWebpackPlugin({
        template: './public/upgrade.html',
        filename: 'upgrade.html',
      }),

      new HtmlWebpackPlugin({
        template: './public/token.html',
        filename: 'token.html',
      }),
    // Add other HTML files as needed...
  ],
};
