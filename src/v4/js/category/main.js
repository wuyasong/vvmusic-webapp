require('../../scss/pages/category.scss');

// 引入发布订阅模块
var emitter = require('../lib/pubsub');

// 左侧导航模块
var category_nav = require('./components/category_nav');
// 右侧内容模块
var category_content = require('./components/category_content');

// 左侧分类导航操作
category_nav.init(emitter);

// 监听数据加载完成事件
emitter.subscribe('dataloaded', function (data) {
    // 右侧分类列表内容操作
    category_content.init(data);
});