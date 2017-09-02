const path = require('path');
const Webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Loader = require('./webpack.loader.js');

const Config = {
    devtool: 'cheap-module-source-map',
    entry: './source/main.js',
    output: {
        path: path.resolve(__dirname, 'test'),
        filename: 'test.js',
        publicPath: '/',
        sourceMapFilename: '[name].map'
    },
    module: Loader,
    plugins: [
        // new Webpack.optimize.UglifyJsPlugin({
        //   compress: {
        //     warnings: false
        //   }
        // }),
        new Webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            //template: './ejs/index.ejs',
            //title: 'my first webpack',
            template: './html/test.html',
            inject: true,
            favicon: './images/icon.png',
            minify: false,
            hash: true
        })
    ],
    devServer: {
        hot: true,
        stats: 'minimal',
        historyApiFallback: true,
        contentBase: path.join(__dirname, 'test'),
        publicPath: '/',
        inline: true,
        port: 9999
    },
    externals: {
        jquery: 'jQuery'
    },
    performance: {
        hints: 'warning',
        maxEntrypointSize: 400000,
        maxAssetSize: 100000
    }
};

module.exports = Config;