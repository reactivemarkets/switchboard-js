/* eslint-disable */

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const template = require("html-webpack-template");
const path = require("path");

module.exports = {
    bail: true,
    devServer: {
        compress: true,
        contentBase: "dist",
        disableHostCheck: true,
        historyApiFallback: true,
        inline: true,
        watchContentBase: true,
        port: 8080,
    },
    entry: {
        main: "./src/index.tsx",
    },
    output: {
        filename: "[name].[chunkhash:8].js",
        chunkFilename: "[name].[chunkhash:8].js",
        path: path.join(__dirname, "dist"),
        publicPath: "/",
    },
    mode: "development",
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    optimization: {
        splitChunks: {
            chunks: "all",
        },
        runtimeChunk: true,
    },
    plugins: [
        new CleanWebpackPlugin(),
        new Dotenv(),
        new HtmlWebpackPlugin({
            inject: false,
            template,
            appMountId: "app",
            bodyHtmlSnippet: "<noscript>You need to enable JavaScript to run this app!</noscript>",
            lang: "en",
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            },
            mobile: true,
            title: "Reactive Platform SDK",
        }),
    ],
};
