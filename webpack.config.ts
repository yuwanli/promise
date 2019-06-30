const path = require('path');
module.exports = {
    mode: "development",
    devtool: "inline-source-map", 
    entry: "./index.ts",
    output: {
        filename: 'index.js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'), 
        compress: true, 
        historyApiFallback: true, 
        hot: true,
    }
}