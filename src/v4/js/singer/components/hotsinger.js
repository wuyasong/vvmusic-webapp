
// 引入全局配置文件
var config = require('../../config');
// 引入client代理网络请求组件
var fetch = require('../../lib/proxy-request');

var Transform = require('../../lib/transform');
var AlloyTouch = require('../../lib/alloy_touch');
var hotSinger_view = require('../views/hot_singer.tpl');

module.exports = (function () {
    return {
        length: 1,
        init (emitter) {
            var _this = this;
            // 请求数据
            fetch.http({
                url: config.protocol + config.domain + '/sod?action=6',
                data: {
                    moduleCode: 'YKGX'
                },
                success (data) {
                    if (data.retCode == 1000) {
                        _this.length = data.ads.length;
                        // 渲染视图
                        _this.render(data);
                        // 绑定事件
                        _this.bindEvent();
                        // 执行滑动动画
                        _this.carrousel();
                        // 缓存数据
                        localStorage.setItem('vvmusic_singer_hot', JSON.stringify(data));
                    }
                    // 触发加载数据完成事件
                    emitter.publish('dataloaded');
                },
                error () {  // 无网处理
                    // 从缓存读取数据
                    var data = localStorage.getItem('vvmusic_singer_hot');
                    data && this.success(JSON.parse(data));
                }
            });
        },
        render (data) {
            $('.singer-list ul').html(hotSinger_view({list: data.ads}));
        },
        bindEvent () {
            $('.singer-list li').off('tap').on('tap', function () {
                var id = $(this).attr('data-id');
                var title = $(this).attr('data-title');
                var url1 = $(this).attr('data-src');

                fetch.native('gotoToplist', {msg: id, type: 4, title: title, url1: url1});
            });
        },
        carrousel () {
            var scroller = document.querySelector('.singer-list ul');
            
            Transform(scroller);
            new AlloyTouch({
                touch: '.singer-list',//反馈触摸的dom
                vertical: false,//不必需，默认是true代表监听竖直方向touch
                target: scroller, //运动的对象
                property: 'translateX',  //被运动的属性
                min: 0.2125 * window.innerWidth * -this.length + window.innerWidth, //不必需,运动属性的最小值  根据设计稿尺寸 图片宽度加两边边距 136 / 640 = 0.2125
                max: 0 //不必需,滚动属性的最大值
            })
        }
    };
})();