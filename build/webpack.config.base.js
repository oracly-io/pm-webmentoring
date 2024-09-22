const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')

const path = require('path')
const webpack = require('webpack')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const config = require('./config')

const projectRoot = path.resolve(__dirname, '../')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')

const appTypeName = config.applicationType
const appTypeConfig = config[appTypeName] || {}

module.exports = {
  // Where webpack looks to start building the bundle
  entry: {
    app: projectRoot + '/src/boot/app.js'
  },

  // Where webpack outputs the assets and bundles
  output: {
    path: config.outputPath,
    publicPath: config.outputPublicPath,
    filename: config.outputFilename,
    chunkFilename: config.outputChunkFilename
  },

  // Customize the webpack build process
  plugins: [
    // Removes/cleans build folders and unused assets when rebuilding
    // new CleanWebpackPlugin(),

    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),

    // Generates an HTML file from a template
    // Generates deprecation warning: https://github.com/jantimon/html-webpack-plugin/issues/1501
    new HtmlWebpackPlugin({
      title: 'OraclyV1 Web Mentor Platform',
      favicon: config.faviconPath,
      filename: config.htmlOutputFilename,
      template: config.htmlTemplatePath,
      baseUrl: config.baseUrl,
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      chunksSortMode: 'auto',
      meta: {
        ...appTypeConfig['meta']
      },
    }),

    new MiniCssExtractPlugin({
      filename: config.cssOutputFilename
    }),

    new webpack.DefinePlugin(config.replaceConfig),

    new ESLintPlugin({
      extensions: ['js'],
    })
  ],

  optimization: {
    emitOnErrors: false,
    minimize: false,
    splitChunks: {
      cacheGroups: {
        default: {
          priority: 1
        },
        vendors: {
          test: /[\\/]node_modules[\\/].*\.js$/,
          priority: 2,
          name: 'vendor',
          chunks: 'all'
        },
        objects: {
          test: /.*\.json$/,
          priority: 3,
          name: 'json',
          chunks: 'all'
        },
      }
    }
  },

  // Determine how modules within the project are treated
  module: {
    rules: [
      // JavaScript: Use Babel to transpile JavaScript files
      {
        test: /\.js$/,
        loader: require.resolve('babel-loader'),
        include: projectRoot,
        exclude: /node_modules/,
      },

      // Styles: Inject CSS into the head with source maps
      {
        test: /\.(scss|sass|css)$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              modules: {
                mode: 'local',
                auto: true,
                exportGlobals: true,
                exportOnlyLocals: false,
                localIdentName: '[local]-[hash:base64:5]',
                localIdentContext: path.resolve(__dirname, 'src'),
                localIdentHashSalt: 'M'
              }
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              postcssOptions: {
                plugins: [autoprefixer(), cssnano()]
              }
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },

      // Images: Copy image files to build folder
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|svg)$/i,
        type: 'asset',
        generator: {
          filename: 'img/[name].[hash:7][ext]'
        }
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack', 'url-loader'],
        type: 'javascript/auto',
        generator: {
          filename: 'img/[name].[hash:7][ext]'
        }
      },
      // Fonts inline files
      {
        test: /\.(woff(2)?|eot|ttf|otf)$/,
        type: 'asset',
        generator: {
          filename: 'fonts/[name].[hash:7][ext]'
        }
      }
    ],
  },

  resolve: {
    modules: [projectRoot, 'node_modules'],
    extensions: [
      '.js', '.json', '.css', '.scss', '.sass',
      '.svg', '.png', '.jpeg', '.gif'
    ],
    alias: {
      // alias react for npm linking pm-react-components
      'react': projectRoot + '/node_modules/react',

      '@': projectRoot + '/src',
      '@static': projectRoot + '/static',
      '@abis': projectRoot + '/abis',
      '@constants': projectRoot + '/src/constants',
      '@lib': projectRoot + '/src/lib',
      '@hooks': projectRoot + '/src/hooks',
      '@config': projectRoot + '/src/config',
      '@state': projectRoot + '/src/state',
      '@actions': projectRoot + '/src/state/actions',
      '@asynchronous': projectRoot + '/src/asynchronous',
      '@languages': projectRoot + '/src/languages',
      '@styles': projectRoot + '/src/' + appTypeName + '/styles',
      '@routing': projectRoot + '/src/' + appTypeName + '/routing',
      '@pages': projectRoot + '/src/' + appTypeName + '/presentation/pages',
      '@components': projectRoot + '/src/' + appTypeName + '/presentation/components/',
      '@utils': projectRoot + '/src/utils',
      '@interceptors': projectRoot + '/src/interceptors',
      '@boot': projectRoot + '/src/boot'
    }
  },
}
