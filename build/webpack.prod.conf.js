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
        path: path.resolve(__dirname, '../dist/v4_prod'),
        // filename: '[name]/[name].[hash:8].js',
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
                            loader: 'css-loader',
                            options: {
                                minimize: true //css压缩
                            }
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
                })
            },
            {
                test: /\.scss$/,
                loader: ExtractPlugin.extract({
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: true //css压缩
                            }
                        },
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
                })
            },
            {
                test: /\.html$/,
                loader: 'ejs-loader',
            },
            {
                test: /\.tpl$/,
                loader: "tmod-loader",
                query: {
                    // 编译输出目录设置
                    output: '../dist/v4_prod',

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
                    publicPath: '/v4/app/'
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.scss'],
        // alias: {
        //     'zepto': path.resolve(__dirname, '../src/v4/js/lib/zepto.min.js')
        // }
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: path.resolve(__dirname, '../dist/v4_prod/index/index.html'),
            template: path.resolve(__dirname, '../src/v4/index.html'),
            minify: {
                removeComments: true, //移除HTML中的注释
                collapseWhitespace: false //删除空白符与换行符
            },
            inject: false,
            chunks: ['index'],
        }),
        new HtmlWebpackPlugin({
            filename: path.resolve(__dirname, '../dist/v4_prod/category/category.html'),
            template: path.resolve(__dirname, '../src/v4/category.html'),
            minify: {
                removeComments: true, //移除HTML中的注释
                collapseWhitespace: false //删除空白符与换行符
            },
            inject: false,
            chunks: ['category']
        }),
        new HtmlWebpackPlugin({
            filename: path.resolve(__dirname, '../dist/v4_prod/rankinglist/rankinglist.html'),
            template: path.resolve(__dirname, '../src/v4/rankinglist.html'),
            minify: {
                removeComments: true, //移除HTML中的注释
                collapseWhitespace: false //删除空白符与换行符
            },
            inject: false,
            chunks: ['rankinglist']
        }),
        new HtmlWebpackPlugin({
            filename: path.resolve(__dirname, '../dist/v4_prod/songlist/songlist.html'),
            template: path.resolve(__dirname, '../src/v4/songlist.html'),
            minify: {
                removeComments: true, //移除HTML中的注释
                collapseWhitespace: false //删除空白符与换行符
            },
            inject: false,
            chunks: ['songlist']
        }),
        new HtmlWebpackPlugin({
            filename: path.resolve(__dirname, '../dist/v4_prod/singer/singer.html'),
            template: path.resolve(__dirname, '../src/v4/singer.html'),
            minify: {
                removeComments: true, //移除HTML中的注释
                collapseWhitespace: false //删除空白符与换行符
            },
            inject: false,
            chunks: ['singer']
        }),
        new ExtractPlugin('[name]/[name].css'),
        new webpack.optimize.UglifyJsPlugin({
            //不显示警告
            compress: {
                warnings: false
            },
            // sourceMap: true,  //这里的soucemap 不能少，可以在线上生成soucemap文件，便于调试
            // mangle: {  
            //     //mangle 通过设置except数组来防止指定变量被改变 (防止指定变量被混淆)  
            //     except: ['$super', '$', 'exports', 'require']  
            // }  
        }),
        // new webpack.DefinePlugin({
        //    'process.env': {
        //        NODE_ENV: '"production"'
        //    }
        // })
    ]
};