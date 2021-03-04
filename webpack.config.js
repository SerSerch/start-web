const path = require('path'),
  fs = require('fs'),
  HTMLplugin = require('html-webpack-plugin'),
  AppCachePlugin = require('appcache-webpack-plugin'),
  MiniCssExtractPlugin = require('mini-css-extract-plugin'),
  UglifyJsPlugin = require('uglifyjs-webpack-plugin'),
  OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'),
  getScopedName = require('./getScopedName');

const isDevelopment = process.env.NODE_ENV === 'development';
const PAGES_DIR = path.join(__dirname, 'src', 'pages');
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.pug'))

module.exports = {
  entry: {
    main: path.resolve(__dirname, 'src', 'index.js'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  devServer: {
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /(\.webmanifest|browserconfig\.xml|service-worker[^\/\\]*\.js|swiper[^\/\\]*\.js)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: '/',
            }
          }
        ]
      },
      {
        test: /\.module\.s[ac]ss$/,
        use: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                ...(isDevelopment ? {
                  localIdentName: '[path]_[name]_[local]',
                } : {
                  getLocalIdent: (context, localIdentName, localName) => (
                    getScopedName(localName, context.resourcePath)
                  ),
                }),
              },
              sourceMap: isDevelopment,
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: isDevelopment
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDevelopment
            }
          }
        ]
      },
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: /\.module.(sa|sc|c)ss$/,
        use: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('dart-sass'),
            },
          },
        ],
      },
      {
        test: /\.(svg|gif|png|jpe?g)$/,
        exclude: /favicons|fonts/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'img',
            }
          },
        ]
      },
      {
        test: /\.(eot|ttf|woff|woff2|svg)$/,
        exclude: /favicons|images/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts',
            }
          }
        ]
      },
      {
        test: /\.(svg|ico|png)$/,
        exclude: /fonts|images/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            }
          },
        ]
      },
      {
        test: /\.pug$/,
        use: 'pug-loader'
      },
    ]
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      img: path.resolve(__dirname, 'src', 'images'),
      svg: path.resolve(__dirname, 'src', 'images', 'svg'),
      sass: path.resolve(__dirname, 'src', 'sass'),
      fonts: path.resolve(__dirname, 'src', 'fonts'),
      '@': path.resolve(__dirname, 'src'),
    }
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
  plugins: [
    ...PAGES.map(page => new HTMLplugin ({
      template: path.resolve(__dirname, 'src', 'pages', page),
      filename: `${page.replace(/\.pug/,'.html')}`,
      minify: false,
      meta: {
        'viewport': 'width=device-width, initial-scale=1, shrink-to-fit=no',
        'theme-color': '#00B8FC'
      },
      scriptLoading: 'defer',

    })),
    new MiniCssExtractPlugin({
      filename: isDevelopment ? '[name].css' : '[name].[hash].css',
      chunkFilename: isDevelopment ? '[id].css' : '[id].[hash].css'
    }),
  ],
};