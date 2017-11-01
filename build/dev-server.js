// 引入依赖模块
const express = require('express');
const webpack = require('webpack');
const path = require('path');
const url = require('url');
const proxy = require('express-http-proxy');
const config = require('./webpack.dev.conf');
const port = 8080;

// 创建一个express实例
const app = express();

var compiler = webpack(config);

// 代理服务
app.use('/sod', proxy('http://x.xxxxx.cn', {
    parseReqBody: false,
    proxyReqPathResolver (req) {
        var _url = url.parse(req.url).path;

        if (req.url.indexOf('/sod') < 0) {
            _url = '/sod' + _url.replace(/\//, '')
            console.info('_url:'+_url)
            return _url;
        }
        console.info('_url:'+_url)

        return _url;
    }
}));

var devMiddleware = require('webpack-dev-middleware')(compiler, {
    inline: true,
    hot: true,
    publicPath: config.output.publicPath,
    filname: config.output.filename,
    stats: {
        colors: true,
        chunks: false
    }
});

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
    // log: console.log,
    // path: '/_webpack_hmr'
});

compiler.plugin('compilation', (compilation) => {
    compilation.plugin('html-webpack-plugin-after-emit', (data, callback) => {
        hotMiddleware.publish({action: 'reload'});
        callback();
    });
})

app.use(devMiddleware);
app.use(hotMiddleware);
// 静态资源服务
app.use(express.static('dist/v4'));

app.listen(port, (err) => {
     if (err) {
         console.log(err);
         return;
     }
     console.log('listening at http://localhost:' + port);
});