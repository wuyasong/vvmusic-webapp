// 引入全局配置文件
var config = require('../../config');
// 引入client代理网络请求组件
var fetch = require('../../lib/proxy-request');

module.exports = {
    init (emitter) {
        // 请求数据
        fetch.http({
            url: config.protocol + config.domain + '/sod?action=3',
            success (data) {
                if (data.retCode == 1000) {
                    // 缓存数据
                    localStorage.setItem('vvmusic_category_nav', JSON.stringify(data));
                    // 缓存左侧导航数据，返回给订阅者
                    emitter.publish('dataloaded', data.CategoryInfo);
                }
            },
            error () {  // 无网处理
                // 从缓存读取数据
                var data = localStorage.getItem('vvmusic_category_nav');
                // 缓存左侧导航数据，返回给订阅者
                emitter.publish('dataloaded', JSON.parse(data).CategoryInfo);
            }
        });
    }
};