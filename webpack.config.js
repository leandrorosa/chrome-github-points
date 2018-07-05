const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const webpackServeWaitpage = require('webpack-serve-waitpage')

module.exports = {
  mode: 'production',
  entry: {
    'content-script': './src/content-script.ts',
    'popup': './src/popup.ts',
  },
  output: {
    path: `${__dirname}/dist/scripts`,
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader'
      },
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'public/', to: `${__dirname}/dist` }
    ])
  ],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
    extensions: [
      '.css', '.ts', '.tsx', '.js', '.json'
    ],
  },
  optimization: {
    minimizer: process.env.WEBPACK_SERVE ? [] : [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: false,
          ecma: 6,
          mangle: true
        },
        sourceMap: true
      })
    ]
  },
  serve: {
    port: 3000,
    // http2: true, // Node.js v9+
    add: (app, middleware, options) => {
      app.use(webpackServeWaitpage(options, { theme: 'dark' }))
    }
  }
}
