const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');

// 引入基本配置
const config = require('./webpack.base.conf');

config.output.publicPath = '/';


config.plugins = [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
        filename: path.resolve(__dirname, '../dist/v4/index/index.html'),
        template: path.resolve(__dirname, '../src/v4/index.html'),
        inject: false,
        chunks: ['index']
    }),
    new HtmlWebpackPlugin({
        filename: path.resolve(__dirname, '../dist/v4/category/category.html'),
        template: path.resolve(__dirname, '../src/v4/category.html'),
        inject: false,
        chunks: ['category']
    }),
    new HtmlWebpackPlugin({
        filename: path.resolve(__dirname, '../dist/v4/rankinglist/rankinglist.html'),
        template: path.resolve(__dirname, '../src/v4/rankinglist.html'),
        inject: false,
        chunks: ['rankinglist']
    }),
    new HtmlWebpackPlugin({
        filename: path.resolve(__dirname, '../dist/v4/songlist/songlist.html'),
        template: path.resolve(__dirname, '../src/v4/songlist.html'),
        inject: false,
        chunks: ['songlist']
    }),
    new HtmlWebpackPlugin({
        filename: path.resolve(__dirname, '../dist/v4/singer/singer.html'),
        template: path.resolve(__dirname, '../src/v4/singer.html'),
        inject: false,
        chunks: ['singer']
    }),
    new ExtractPlugin('[name]/[name].css')
];

// const devClient = 'webpack-hot-middleware/client?reload=true';
const devClient = './build/dev-client';

Object.keys(config.entry).forEach((name, i) => {
    var extras = [devClient];
    config.entry[name] = extras.concat(config.entry[name]);
});

module.exports = config;