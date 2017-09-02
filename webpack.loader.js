const ExtractTextPlugin = require("extract-text-webpack-plugin");

const Loader = {
    rules: [
        {
            test: /\.(js|jsx)$/,
            use: [
                {
                    loader: 'babel-loader'
                }
            ],
            exclude: '/mode_modules/'
        },
        {
            test: /\.(jpg|png)$/,
            use: [
                {
                    loader: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]'
                }
            ]
        },
        {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: "css-loader"
            })
        },
        {
            test: /\.scss$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: ['css-loader', 'sass-loader']
            })
        },
        {
            test: /\.html$/,
            use: {
                loader: 'raw-loader'
            }
        }
    ]
};

module.exports = Loader;