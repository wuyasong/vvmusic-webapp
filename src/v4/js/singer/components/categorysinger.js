
// 引入全局配置文件
var config = require('../../config');
// 引入client代理网络请求组件
var fetch = require('../../lib/proxy-request');

var categorySinger_view = require('../views/category_singer.tpl');

module.exports = (function () {
    return {
        init () {
            var _this = this;
            // 请求数据
            fetch.http({
                url: config.protocol + config.domain + '/sod?action=0',
                success (data) {
                    if (data.retCode == 1000) {
                        // 渲染视图
                        _this.render(data);
                        // 绑定事件
                        _this.bindEvent();
                        // 缓存数据
                        localStorage.setItem('vvmusic_singer_category', JSON.stringify(data));
                    }
                },
                error () {  // 无网处理
                    // 从缓存读取数据
                    var data = localStorage.getItem('vvmusic_singer_category');
                    data && this.success(JSON.parse(data));
                }
            });
        },
        render (data) {
            $('.singer-category ul').html(categorySinger_view({list: data.CategoryInfo}));
        },
        bindEvent () {
            $('.singer-category li').off('tap').on('tap', function () {
                var id = $(this).attr('data-id');
                var title = $(this).attr('data-title');

                fetch.native('gotoSinger', {msg: id, title: title});
            });
        }
    };
})();