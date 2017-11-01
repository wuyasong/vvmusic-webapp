// 引入全局配置文件
var config = require('../../config');
// 引入client代理网络请求组件
var fetch = require('../../lib/proxy-request');
// 引入下拉刷新模块
var pulldownrefresh = require('../../lib/pull-down-refresh');

var rankinglist_view = require('../views/rankinglist.tpl');

var pullrefresh = null;

module.exports = (function () {
    return {
        init (){
            // 请求榜单数据
            this.requestListData();

            // 下拉刷新
            pullrefresh = pulldownrefresh(document.querySelector('.container') /* 第一个参数传用来绑定touch事件的元素 */, {  // 第二个参数传入对象
                pullElem: document.querySelector('.touchlist'),  // 内容列表 下拉时移动的层
                topOffset: 52,  // 下拉改变效果的距离

                // 手指滑动时和松开时触发
                onRefresh: function(state){
                    if (state == 2) {  // 手指松开时触发 满足刷新条件
                        //重新渲染首页数据
                        module.exports.init();
                    }
                }
            });
        },
        requestListData () {
            var _this = this;

            // 请求数据
            fetch.http({
                url: config.protocol + config.domain + '/sod?action=34',
                data: {
                    beginIndex: 0,
                    rows: 20,
                    type: 1
                },
                success (data) {
                    $('.downRefreshElem').show();
                    if (data.retCode == 1000) {
                        // 渲染视图
                        _this.render(data);
                        // 绑定事件
                        _this.bindEvent();
                        // 缓存数据
                        localStorage.setItem('vvmusic_rankinglist_list', JSON.stringify(data));
                    }

                    pullrefresh.refresh();
                },
                error () {  // 无网处理
                    $('.downRefreshElem').show();
                    // 从缓存读取数据
                    var data = localStorage.getItem('vvmusic_rankinglist_list');
                    data && this.success(JSON.parse(data));

                    pullrefresh.refresh();
                }
            });
        },
        render (data) {
            $('.rankinglist').html(rankinglist_view({list: data.songMenus}));
        },
        bindEvent () {
            $('.rankinglist-box ').off('tap').on('tap', function () {
                var id = $(this).attr('data-songMenuID');
                var title = $(this).attr('data-title');
                var url1 = $(this).attr('data-picture');
                var url2 = $(this).attr('data-headPicture');

                fetch.native('gotoToplist', {msg: id, type: 5, title: title, url1: url1, url2: url2});
            });
        },
    };
})();