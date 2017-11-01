// 引入首页样式
require('../../scss/pages/index.scss');

// 引入全局配置文件
var config = require('../config');
// 引入client代理网络请求组件
var fetch = require('../lib/proxy-request');
// 引入解析url参数模块
var getParameter = require('../lib/getParameter');
// 引入下拉刷新模块
var pulldownrefresh = require('../lib/pull-down-refresh');

// 引入业务模块
var initHandle = require('./components/init');
var playlist = require('./components/playlist');  // 轮播图
var navigation = require('./components/navigation');  // 图标导航
var guide = require('./components/guide');   // 引导图
var recommand_songlist = require('./components/recommand_songlist');  // 推荐歌曲列表

// window.onerror = function (errorMessage, scriptURI, lineNumber,columnNumber,errorObj) {
//     // alert(errorMessage);
// }
// 验证是否是从房间进入
var isRoom = getParameter('copyright') == 'down';
var pullrefresh = null;

function loadData (userID) {
    // 获取乐库数据
    fetch.http({
        url: config.protocol + config.domain + '/sod?action=60001',
        success (data) {
            // 轮播图业务
            !isRoom && playlist.init(data);
            // 中间推荐歌曲业务
            !isRoom && guide.init(data);
            // 歌曲列表操作
            recommand_songlist.init(userID, isRoom);
            // 缓存数据
            localStorage.setItem('vvmusic_index_ads', JSON.stringify(data));

            pullrefresh.refresh();
        },
        error () {  // 无网处理
            // 从缓存读取数据
            var data = localStorage.getItem('vvmusic_index_ads');
            // 轮播图业务
            !isRoom && playlist.init(JSON.parse(data));
            // 中间推荐歌曲业务
            !isRoom && guide.init(JSON.parse(data));
            // 歌曲列表操作
            recommand_songlist.init(userID, isRoom);

            pullrefresh.refresh();
        }
    });
}

fetch.native('getContext', {offline: true}, function (data) {
    var userID = null;
    
    if (data.userInfo) 
        userID = (data.userInfo.VVNum ? data.userInfo.VVNum : data.userInfo.vVNum);

    // 加载数据
    loadData(userID);

    var scroller = document.querySelector('.container');
    var touchlist = document.querySelector('.touchlist');

    // 下拉刷新
    pullrefresh = pulldownrefresh(scroller /* 第一个参数传用来绑定touch事件的元素 */, {  // 第二个参数传入对象
        pullElem: touchlist,  // 内容列表 下拉时移动的层
        topOffset: 52,  // 下拉改变效果的距离

        // 手指滑动时和松开时触发
        onRefresh: function(state){
            if (state == 2) {  // 手指松开时触发 满足刷新条件
                //重新渲染首页数据
                loadData(userID);
            }
        }
    });
});

// 初始化处理操作
initHandle(isRoom);

// 导航操作
navigation.init(isRoom);
