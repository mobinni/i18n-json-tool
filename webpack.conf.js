const webpack = require("webpack");
const path = require("path");
const libraryName = "library";
const outputFile = libraryName + ".js";

const config = {
    entry: __dirname + "/src/translate.js",
    devtool: "source-map",
    output: {
        path: __dirname + "/lib",
        filename: outputFile,
        library: libraryName,
        libraryTarget: "umd",
        umdNamedDefine: true
    },
    module: {
        rules: [
            {
                test: /(\.jsx|\.js)$/,
                loader: "babel-loader",
                exclude: /(node_modules|bower_components)/
            },
        ]
    }
};

module.exports = config;
