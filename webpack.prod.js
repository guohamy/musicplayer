const path = require('path');
const Webpack = require('webpack');
const Loader = require('./webpack.loader.js');
const { Entry,Output,Plugins } = require('./webpack.file.js');

const Config = {
    devtool: 'cheap-module-source-map',
    entry: Entry,
    output: Output,
    module: Loader,
    plugins: [
        new Webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        }),
        new Webpack.optimize.UglifyJsPlugin({
            output: {
                comments: false,  // remove all comments
            },
            compress: {
                warnings: false
            }
        }),
        ...Plugins],
    devServer: {
        hot: true,
        stats: 'minimal',
        historyApiFallback: true,
        contentBase: path.join(__dirname, 'source'),
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