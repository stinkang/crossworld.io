
/// <binding />
"use strict";
var path = require("path");
var WebpackNotifierPlugin = require("webpack-notifier");
var BrowserSyncPlugin = require("browser-sync-webpack-plugin");
module.exports = {
    entry: ['babel-polyfill', "./wwwroot/src/index.tsx"],
    output: {
        path: path.resolve(__dirname, "./wwwroot/dist"),
        filename: "bundle.js"
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