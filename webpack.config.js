const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const DashboardPlugin = require('webpack-dashboard/plugin');
const getHostIp = require('./scripts/getHostIp');

const isProduction = process.env.NODE_ENV === 'production';
const publicPath = isProduction ? '/NovelReader/' : '/dist/';
const port = 9000;

console.log(`open: http://${getHostIp()}:${port}/dist/`);

const config = {
  entry: {
    vendor: [
      'react', 'react-dom', 'react-router-dom',
      'prop-types', 'classnames', 'whatwg-fetch',
    ],
    app: ['normalize.css', './src/index'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]-[chunkhash:8].js',
    publicPath,
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        loader: 'eslint-loader',
        enforce: 'pre',
        exclude: /node_modules/,
      },
      {
        test: /\.jsx?/,
        include: [
          path.resolve(__dirname, 'src'),
        ],
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: isProduction,
                modules: true,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [autoprefixer],
              },
            },
          ],
        }),
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: isProduction,
                modules: true,
                localIdentName: '[name]__[local]-[hash:base64:5]',
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [autoprefixer],
              },
            },
            'less-loader',
          ],
        }),
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor-[chunkhash:8].js',
      minChunks: Infinity,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        PROXY_API: JSON.stringify('https://api.caoyongzheng.com/proxy'),
        // PROXY_API: JSON.stringify('http://localhost:3000/proxy'),
      },
    }),
    new ExtractTextPlugin({
      filename: '[name]-[contenthash:8].css',
      disable: false,
      allChunks: true,
    }),
    new HtmlWebpackPlugin({
      chunks: ['vendor', 'app'],
      template: path.resolve(__dirname, 'src/index.html'),
      filename: path.join(__dirname, 'dist', 'index.html'),
    }),
    new DashboardPlugin(),
  ],
  devtool: isProduction ? 'source-map' : 'eval',
  devServer: {
    host: '0.0.0.0',
    contentBase: path.join(__dirname, 'dist'),
    port,
    compress: true,
    publicPath,
    disableHostCheck: true,
    noInfo: true,
  },
};

if (isProduction) {
  const CleanAssetsPlugin = new CleanWebpackPlugin(['dist'], {
    root: path.resolve(__dirname),
    verbose: true,
    dry: false,
  });
  config.plugins.push(CleanAssetsPlugin);
}

module.exports = config;
