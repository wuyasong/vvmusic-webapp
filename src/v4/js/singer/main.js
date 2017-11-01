require('../../scss/pages/singer.scss');

// 引入发布订阅模块
var emitter = require('../lib/pubsub');

// 热门歌手模块
var hot_singer = require('./components/hotsinger');
// 歌手分类模块
var category_singer = require('./components/categorysinger');

// 热门歌手操作
hot_singer.init(emitter);

// 订阅数据加载完成事件
emitter.subscribe('dataloaded', function () {
    category_singer.init();
});