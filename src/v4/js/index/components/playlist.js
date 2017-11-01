
// 引入client代理网络请求组件
var fetch = require('../../lib/proxy-request');

var Swipe = require('../../lib/swipe');
var playlist_view = require('../views/playlist.tpl');

var playlist = (function () {
    return {
        length: 1,
        init (data) {
            var _this = this;
            if (data.retCode == 1000) {
                this.length = data.spaceAdHomepage.length;
                // 渲染数据
                this.render(data);
                // 轮播图动效
                this.carrousel();
                // 轮播图绑定点击事件
                this.linkTo(data.spaceAdHomepage);
            }
        },
        // 渲染视图
        render (data) {
            $('.carrousel').html( playlist_view({list: data.spaceAdHomepage}) );
        },
        // 轮播图交互
        carrousel () {
            var slider = Swipe(document.querySelector(".carrousel"), {
                auto: 5000,
                stopPropagation: true,
                callback: function(index, element) {
                    $('.indicator-list span').eq(index).addClass('current').siblings().removeClass('current');
                }
            });
        },
        // 跳转（此处需用click事件来解决和swipe插件的事件冲突）
        linkTo (data) {
            $('.carrousel-item').off('click').on('click', function (e) {
                var i = $(this).index();

                fetch.native('gotoTarget', {msg: JSON.stringify(data[i])});
            });
        }
    };
})();

module.exports = playlist;