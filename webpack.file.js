const Webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const Entry = './source/main.js';

const Output = {
    path: path.resolve(__dirname, 'public'),
    filename: 'main.js',
    publicPath: '//music.guohamy.cn/music/',
    sourceMapFilename: '[name].map'
};

const Plugins = [
    new ExtractTextPlugin("styles.css"),
    new Webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
        template: './source/index.html',
        inject: true,
        favicon: './source/images/icon.png',
        minify: false,
        hash: true
    })
];

module.exports = { Entry,Output,Plugins };