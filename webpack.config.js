var path = require('path');

module.exports = {
    entry: "./app/App.jsx",
    output: {
        filename: "app.js",
        path: path.join(__dirname, "bin")
    },
    target: "electron",
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".js", ".jsx", ".json"]
    },

    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: [path.join(__dirname, 'node_modules')],
            loader: ["babel-loader"]
        }]
    }
}