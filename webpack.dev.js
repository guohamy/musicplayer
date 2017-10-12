const path = require('path');
const Loader = require('./webpack.loader.js');
const { Entry,Output,Plugins } = require('./webpack.file.js');

const Config = {
    devtool: 'cheap-module-eval-source-map',
    entry: Entry,
    output: Output,
    module: Loader,
    plugins: [...Plugins],
    devServer: {
        hot: true,
        stats: 'minimal',
        historyApiFallback: true,
        contentBase: path.join(__dirname, 'source'),
        publicPath: '/',
        inline: true,
        port: 9998
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