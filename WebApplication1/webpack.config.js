
/// <binding />
"use strict";
var path = require("path");
var WebpackNotifierPlugin = require("webpack-notifier");
var BrowserSyncPlugin = require("browser-sync-webpack-plugin");
module.exports = {
    mode: 'development',
    entry: {
        index: './wwwroot/src/Home/index.tsx',
        crossword: './wwwroot/src/Crossword/index.tsx'
    },
    output: {
        path: path.resolve(__dirname, "./wwwroot/dist"),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    devtool: "inline-source-map",
    plugins: [new WebpackNotifierPlugin(), new BrowserSyncPlugin()],
    resolve: {
        extensions: ['.js', '.jsx', '.tsx', '.ts'],
    }
};