// 引入依赖模块
const express = require('express');
const webpack = require('webpack');
const path = require('path');
const url = require('url');
const proxy = require('express-http-proxy');
// const config = require('./webpack.dev.conf');
const config = require('./webpack.prod.conf');
const port = 8083;

// 创建一个express实例
const app = express();

var compiler = webpack(config);

const watching = compiler.watch({
    aggregateTimeout: 300,
    poll: undefined
}, (err, stats) => {
    // webpack编译过程输出到控制台
    console.info(
        stats.toString({
            chunks: false,  // 使构建过程更静默无输出
            colors: true    // 在控制台展示颜色
        })
    );
});

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

// 静态资源服务
app.use(express.static('dist/v4_prod'));

app.listen(port, (err) => {
     if (err) {
         console.log(err);
         return;
     }
     console.log('listening at http://localhost:' + port);
});