const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractPlugin = require('extract-text-webpack-plugin');
const px2rem = require('postcss-px2rem');
const webpack = require('webpack');

module.exports = {
    entry: {
        'index': path.resolve(__dirname, '../src/v4/js/index/main.js'),
        'songlist': path.resolve(__dirname, '../src/v4/js/songlist/main.js'),
        'category': path.resolve(__dirname, '../src/v4/js/category/main.js'),
        'rankinglist': path.resolve(__dirname, '../src/v4/js/rankinglist/main.js'),
        'singer': path.resolve(__dirname, '../src/v4/js/singer/main.js'),
    },
    output: {
        path: path.resolve(__dirname, '../dist/v4'),
        // filename: '[name].[hash:8].js',
        filename: '[name]/[name].js?v=[hash:8]',
        // publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader?presets=es2015',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: ExtractPlugin.extract({
                    use: [
                        {
                            loader: 'css-loader'
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins () {
                                    return [px2rem({remUnit: 64})];
                                }
                            }
                        },
                    ],
                    // fallback: 'style-loader'
                })
            },
            {
                test: /\.scss$/,
                loader: ExtractPlugin.extract({
                    use: [
                        {loader: 'css-loader'},
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins () {
                                    return [px2rem({remUnit: 64})];
                                }
                            }
                        },
                        {
                            loader: 'sass-loader'
                        },
                    ],
                    // fallback: 'style-loader'
                })
            },
            {
                test: /\.html$/,
                loader: 'ejs-loader'
            },
            {
                test: /\.tpl$/,
                loader: "tmod-loader",
                query: {
                    // 编译输出目录设置
                    // output: path.resolve(__dirname, '../dist/v4'),
                    output: '../dist/v4',

                    // 设置输出的运行时路径
                    runtime: 'src/v4/js/lib/template.js',
                    

                    // 定义模板采用哪种语法，内置可选：
                    // simple: 默认语法，易于读写。可参看语法文档
                    // native: 功能丰富，灵活多变。语法类似微型模板引擎 tmpl
                    syntax: "simple",

                    // 模板文件后缀
                    suffix: '.tpl'
                } 
            },
            {
                test: /\.(png|gif|jpg)$/,
                loader: 'url-loader',
                options: {
                    limit: 8192,
                    fallback: 'file-loader',
                    name: 'images/[name].[ext]',
                    publicPath: '/'
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', 'scss'],
        alias: {
            'zepto': path.resolve(__dirname, '../src/v4/js/lib/zepto.min.js')
        }
    },
    plugins: [
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
    ]
};