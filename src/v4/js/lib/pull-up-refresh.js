/**
 * 上拉加载组件
 * auth：owys
 * date：2017/9/14
 * @param {String} load_elem loading元素选择器
 * 接收scroll事件，以供重新绑定滚动事件
 */

function PullUpRefresh (load_elem, opts) {

    // 滚动回调操作
    function scrollLoad () {
        //最下面的loading距离窗口顶部的距离
        var loadingToWindowTop = document.querySelector(load_elem).getBoundingClientRect().top;
        //页面已滚动的高度
        var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop;
        //窗口的高度
        var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;

        //判断如果 最下面的loading距离窗口顶部的距离 + 页面已滚动的高度 < 页面已滚动的高度 + 窗口的高度
        if (loadingToWindowTop + scrollHeight < scrollHeight + windowHeight + 300) {
            //解除window.onscroll事件绑定，否则活动到loading区域中时会多次执行，等到加载完下一屏的数据后再绑定上
            window.onscroll = null;

            // 到达底部后 触发刷新
            opts.onRefresh && opts.onRefresh();
        }
    }

    // 绑定scroll事件
    window.onscroll = scrollLoad;

    // 曝露发布
    return {
        // 重新绑定滚动事件
        scroll () {
            window.onscroll = scrollLoad;
        },
        destory () {
            window.onscroll = null;
        }
    }
};

module.exports = PullUpRefresh;