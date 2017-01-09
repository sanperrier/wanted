const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ModernizrWebpackPlugin = require('modernizr-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
    context: path.resolve('src'),
    entry: {
        main: ['babel-polyfill', './js/index.js']
    },
    output: {
        path: path.resolve('www'),
        filename: 'application.js'
    },
    watchOptions: {
        aggregateTimeout: 100
    },
    devtool: 'source-map',
    resolve: {
        alias: {
            'jquery': "jquery/src/jquery",
            'img': path.resolve('src/img'),
            'sounds': path.resolve('src/sounds'),
            'fonts': path.resolve('src/fonts'),
            'models': path.resolve('src/js/models'),
            'pages': path.resolve('src/js/pages'),
            'widgets': path.resolve('src/js/widgets'),
            'windows': path.resolve('src/js/windows'),
            'utils': path.resolve('src/js/utils'),
            'base': path.resolve('src/js/base.js'),
        },
        modulesDirectories: ['node_modules'],
        extensions: ['', '.js']
    },
    module: {
        loaders: [
            { 
                test: require.resolve('jquery'), 
                loader: 'exports?window.$' 
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                query: {
                    presets: ['es2015'],
                    plugins: ['transform-runtime', ["transform-es2015-modules-commonjs-simple", { "noMangle": true }]]
                }
            },
            {
                test: /\.(jade|pug)$/,
                loader: 'pug',
            },
            {
                test: /\.css$/,
                loader: 'style!css!postcss'
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                loader: 'style!css!postcss!sass',
            },
            {
                test: /\.(png|gif|jpe?g)$/,
                loader: 'url?name=images/[name].[ext]&limit=65536',
            },
            {
                test: /\.(ttf|eot|svg|woff|woff2)/,
                loader: 'url?name=fonts/[name].[ext]&limit=65536'
            },
            {
                test: /\.(mp3)/,
                loader: 'file?name=sounds/[name].[ext]'
            }
        ]
    },
    postcss: [ autoprefixer({ browsers: ['> 1%','last 2 versions'] }) ],
    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(NODE_ENV),
            DEBUG: NODE_ENV == "development",
            RELEASE: NODE_ENV == "production"
        }),
        new ModernizrWebpackPlugin({
            options: ['setClasses'],
            "feature-detects": [
                "touchevents",
                "css/transforms",
                "css/borderimage"
            ]
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            _: 'underscore',
            Promise: 'bluebird'
        })
    ],
    devServer: {
        host: '0.0.0.0',
        port:8082,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        hot: true,
        historyApiFallback: true,
        contentBase: "www"
    }
}
