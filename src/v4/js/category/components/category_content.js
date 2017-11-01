// 引入全局配置文件
var config = require('../../config');
// 引入client代理网络请求组件
var fetch = require('../../lib/proxy-request');

// 引入发布订阅模块
var emitter = require('../../lib/pubsub');

var category_view = require('../views/category.tpl');

module.exports = (function () {
    var model = {
        nav: []
    };

    return {
        init (data){
            // 更新导航模型
            model.nav = data;
            // 递归请求右侧列表数据
            this.requestListData();
        },
        requestListData () {
            var _this = this,
                category_nav_item;

            // 从栈中抽出一条数据
            category_nav_item = model.nav.shift();

            // 递归完成
            if (!category_nav_item) return false;

            // 请求数据
            fetch.http({
                url: config.protocol + config.domain + '/sod?action=4',
                data: {
                    categoryID: category_nav_item.categoryID
                },
                success (data) {
                    if (data.retCode == 1000) {
                        // 渲染视图
                        _this.render(category_nav_item, data);
                        // 绑定事件
                        _this.bindEvent();
                        // 执行下一次递归
                        _this.requestListData();
                        // 缓存数据
                        localStorage.setItem('vvmusic_category_content_' + category_nav_item.name, JSON.stringify(data));
                    }
                },
                error () {  // 无网处理
                    // 从缓存读取数据
                    var data = localStorage.getItem('vvmusic_category_content_' + category_nav_item.name);
                    // 渲染视图
                    _this.render(category_nav_item, JSON.parse(data));
                    // 绑定事件
                    _this.bindEvent();
                    // 执行下一次递归
                    _this.requestListData();
                }
            });
        },
        render (nav, data) {
            $('.container').append(category_view({nav: nav, list: data.CategoryInfo}));
        },
        bindEvent () {
            $('.category-list li ').off('tap').on('tap', function () {
                var id = $(this).attr('data-categoryID');
                var title = $(this).attr('data-title');
                var url1 = $(this).attr('data-url1'); //大图
                var url2 = $(this).attr('data-url2'); //小图

                fetch.native('gotoCategory', {msg: id, title: title, url1: url1, url2: url2});
            });
        },
    };
})();