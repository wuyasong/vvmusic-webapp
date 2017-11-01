// 引入全局配置文件
var config = require('../../config');
// 引入client代理网络请求组件
var fetch = require('../../lib/proxy-request');
// 引入下拉刷新模块
var pulldownrefresh = require('../../lib/pull-down-refresh');
// 引入上拉加载组件
var pullUpRefresh = require('../../lib/pull-up-refresh');
// 列表视图
var songlist_view = require('../views/songlist.tpl');

var pullrefresh = null;

var model = {
    pulluprefresh: null,  // 上拉加载对象
    data: [],
    rows: 30,
    list_l: {
        data: [],
        height: 0
    },
    list_r: {
        data: [],
        height: 0
    },
    index: 0
};

var songlist = {
    init () {
        // 重置数据模型
        this.resetModel();
        this.requestListData(1);

        // 下拉刷新
        pullrefresh = pulldownrefresh(document.querySelector('.container') /* 第一个参数传用来绑定touch事件的元素 */, {  // 第二个参数传入对象
            pullElem: document.querySelector('.touchlist'),  // 内容列表 下拉时移动的层
            topOffset: 52,  // 下拉改变效果的距离

            // 手指滑动时和松开时触发
            onRefresh: function(state){
                if (state == 2) {  // 手指松开时触发 满足刷新条件
                    //重新渲染首页数据
                    songlist.init();
                }
            }
        });
    },
    resetModel () {
        model = {
            pulluprefresh: null,  // 上拉加载对象
            data: [],
            rows: 30,
            list_l: {
                data: [],
                height: 0
            },
            list_r: {
                data: [],
                height: 0
            },
            index: 0
        }
    },
    render (isFirst) {
        if (isFirst) {
            $('.songlist-left').html(songlist_view({list: model.list_l.data}));
            $('.songlist-right').html(songlist_view({list: model.list_r.data}));
        } else {
            $('.songlist-left').append(songlist_view({list: model.list_l.data}));
            $('.songlist-right').append(songlist_view({list: model.list_r.data}));
        }
    },
    bindEvent () {
        $('.songlist li').off('tap').on('tap', function () {
            var id = $(this).attr('data-songMenuID');
            var title = $(this).attr('data-title');
            var url1 = $(this).attr('data-picture');
            var url2 = $(this).attr('data-headPicture');
            var num = $(this).find('.songlist-data-count').html();

            // 跳转客户端歌单页
            fetch.native('gotoSonglist', {msg: id, title: title, url1: url1, url2: url2});

            // 更新视图中播放次数
            $(this).find('.songlist-data-count').eq(0).html(Number(num) + 1);
        });
        // gotoSonglist
    },
    // 更新模型
    updateModel (data) {
        // 触发上拉加载重新绑定scroll事件
        if(data.length >= model.rows) {
            // 重新绑定scroll事件
            model.pulluprefresh.scroll();
        }
        model.data = model.data.concat(data);
        // 数据页数叠加
        model.index += data.length;
    },
    // 请求歌单数据
    requestListData (isFirst) {
        var _this = this;
        // 获取歌单列表数据
        fetch.http({
            url: config.protocol + config.domain + '/sod?action=34',
            data: {
                beginIndex: model.index,
                rows: model.rows,
                sort: 'priority',
                order: 'asc',
                type: 0
            },
            success (data) {
                if (data.retCode == 1000) {
                    // 解析数据属性
                    _this.parseParam(data.songMenus);
                    // 渲染视图
                    _this.render(isFirst);
                    // 首次加载数据完成，绑定上拉加载事件
                    if (isFirst === 1) {
                        _this.pullUpRefreshHandler();
                        // 缓存数据
                        localStorage.setItem('vvmusic_songlist_list', JSON.stringify(data));
                    }
                    // 更新模型
                    _this.updateModel(data.songMenus);
                    // 绑定事件
                    _this.bindEvent();
                    // 隐藏上拉加载元素
                    $('.pull-up-loading').hide();

                    pullrefresh.refresh();
                }
            },
            error () {  // 无网处理
                // 从缓存读取数据
                var data = localStorage.getItem('vvmusic_songlist_list');
                // 解析数据属性
                _this.parseParam(JSON.parse(data).songMenus);
                // 渲染视图
                _this.render();
                // 绑定事件
                _this.bindEvent();
                // 隐藏上拉加载元素
                $('.pull-up-loading').hide();

                pullrefresh.refresh();
            }
        });
    },
    // 上拉加载操作
    pullUpRefreshHandler () {
        var _this = this;
        model.pulluprefresh = pullUpRefresh('.pull-up-loading-wrapper', {
            onRefresh () {
                // 显示上拉加载元素
                $('.pull-up-loading').show();
                // 触发加载更多操作
                _this.requestListData();
            }
        });
    },
    // 解析数据中的属性
    /**
     * 
     * @param {Object} data 歌单数据list
     */
    parseParam (data) {
        var list_width = document.querySelector('.songlist-left').offsetWidth; 

        // 每次解析前，首先清空模型中两列的数据
        model.list_l.data.length = 0;
        model.list_r.data.length = 0;

        for (var i = 0; i < data.length; i++) {
            var item = data[i],
                li_height;

            // 计算元素所占高度
            item.picwidth !== 0 
                ? li_height = list_width / (item.picwidth / item.picHeight)
                : li_height = list_width;
                
            // 计算高度值最小的列
            var min_list = model.list_l.height > model.list_r.height ? model.list_r : model.list_l;

            // 改变数据中图片在手机中所占的实际高度
            item.pic_screen_height = li_height;
            // 插入对应的模型数组
            min_list.data.push(item);
            // 更新模型中此列高度
            min_list.height += li_height;
        }
    }
};

module.exports = songlist;