
// 引入client代理网络请求组件
var fetch = require('../../lib/proxy-request');

var Transform = require('../../lib/transform');
var AlloyTouch = require('../../lib/alloy_touch');
var guide_view = require('../views/guide.tpl');

var guide = (function () {
    return {
        length: 1,
        init (data) {
            if (data.retCode == 1000) {
                this.length = data.ads.length;
                // 渲染数据
                this.render(data);
                // 滑动列表
                this.carrousel();
                // 列表绑定点击事件
                this.linkTo(); 
            }
        },
        // 渲染视图
        render (data) {
            $('.guide').html( guide_view({list: data.ads}) );
        },
        // 滑动列表
        carrousel () {
            var scroller = document.querySelector('.guide-list');
            var minValue = 0.334375 * window.innerWidth * -this.length + window.innerWidth - 17;
            Transform(scroller);
            new AlloyTouch({
                touch: '.guide',//反馈触摸的dom
                preventDefault: false,
                vertical: false,//不必需，默认是true代表监听竖直方向touch
                target: scroller, //运动的对象
                property: 'translateX',  //被运动的属性
                min: minValue > 0 ? 0 : minValue, //不必需,运动属性的最小值  根据设计稿尺寸 图片宽度加两边边距 214 / 640 = 0.334375
                max: 0 //不必需,滚动属性的最大值
            });
        },
        // 点击跳转
        linkTo (data) {
            $('.guide-list li').on('tap', function () {
                var type = Number($(this).attr('data-type'));
                var title = $(this).attr('data-title');
                var id = $(this).attr('data-linkUrl');
                var url1 = $(this).attr('data-src');
                var url2 = $(this).attr('data-headPic');

                switch (type) {
                    case 0:  // 活动比赛
                        fetch.native('openActivityWebPage', {msg: id, title: title});
                        break;
                    case 1:  // 单曲推荐
                        fetch.native('gotoPlayer', {msg: id, type: 1});
                        break;
                    case 2:  // MV推荐
                        fetch.native('gotoPlayer', {msg: id, type: 2});
                        break;
                    case 3:  // 歌单推荐
                        fetch.native('gotoToplist', {msg: id, type: 3, title: title, url1: url1, url2: url2});
                        break;
                    case 4:  // 歌星推荐（歌手）
                        fetch.native('gotoToplist', {msg: id, type: 4, title: title, url1: url1, url2: url2});
                        break;
                    case 5:  // 榜单推荐
                        fetch.native('gotoToplist', {msg: id, type: 5, title: title, url1: url1, url2: url2});
                        break;
                    case 6:  // 分类推荐
                        fetch.native('gotoCategory', {msg: id, title: title, url1: url1, url2: url2});
                        break;
                }
            });
        }
    };
})();

module.exports = guide;