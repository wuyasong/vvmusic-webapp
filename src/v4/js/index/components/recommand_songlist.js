/**
 * 歌曲推荐列表业务
 * 共三个列表，默认显示第一个
 * 每个列表有一个上拉加载的loading视图，html文件中未写入，是通过js插入文档的
 * 在首次加载数据完成后插入上拉加载的loading视图
 * 上拉加载的loading视图默认只显示最外层pull-up-loading-wrapper元素（用在onscroll事件中判断距离），内层隐藏
 * 当滚动到距页尾300px时，显示pull-up-loading-wrapper元素的内层（正在加载样式视图），加载数据，完成后隐藏（正在加载样式视图）
 */

// 引入全局配置文件
var config = require('../../config');
// 引入client代理网络请求组件
var fetch = require('../../lib/proxy-request');
// 引入上拉加载组件
var pullUpRefresh = require('../../lib/pull-up-refresh');
// 列表视图
var recommand_songlist_view = require('../views/recommand_songlist.tpl');
// 上拉加载视图
var loading_view = require('../views/loading.tpl');
// 引入loading加载图片
// var loadingImg = require('../../../images/loading.png');
// 引入默认头像
var defaultImg = require('../../../images/defaultHead.png');

var recommand_songlist = (function () {
    // 数据模型
    var model = {
        userID: null,
        // 是否为房间进入
        isRoom: false,
        // 当前所在列表类型   0：热场排行   1：猜你喜欢   2：新歌发布
        currType: 0,
        // 当前列表选择器
        currSelector: '',
        // 每次加载的条目数
        rows: 50,
        'hot-list': {
            index: 0,
            action: 60002,
            pulluprefresh: null,  // 上拉加载实例
            pullupelem: null,   // 当前上拉加载元素
            isEnd: false,  // 是否已加载完全部数据
            data: []
        },
        'guess-list': {
            index: 0,
            action: 60003,
            pulluprefresh: null,  // 上拉加载实例
            pullupelem: null,   // 当前上拉加载元素
            isEnd: false,
            data: []
        },
        'arrived-list': {
            index: 0,
            action: 60004,
            pulluprefresh: null,  // 上拉加载实例
            pullupelem: null,   // 当前上拉加载元素
            isEnd: false,  // 是否已加载完全部数据
            data: []
        }
    };

    return {
        init (userID, isRoom) {
            var _this = this;

            // 赋值userID
            model.userID = userID;
            // 赋值是否为房间进入
            model.isRoom = isRoom;

            // 重置数据模型
            this.resetModel();

            // 请求热唱排行列表数据
            this.switchListView(0);
            
            // 点击导航切换事件绑定
            // $('.recsong-nav-item').off('click').on('click', function () {
            $('.recsong-nav-item').off('tap').on('tap', function () {
                var index = $(this).index();
                // 切换高亮样式
                $('.recsong-nav-item').eq(index).addClass('current').siblings().removeClass('current');
                // 切换列表视图
                _this.switchListView(index);
            });

            var winH = window.innerHeight;
            var loadingBox = document.querySelector('.recsong-loading-box');
            $(window).on('scroll', function () {
                module_data.height = winH - loadingBox.getBoundingClientRect().top;
            });
        },
        resetModel () {
            model['hot-list'] = {
                index: 0,
                action: 60002,
                pulluprefresh: null,  // 上拉加载实例
                pullupelem: null,   // 当前上拉加载元素
                isEnd: false,  // 是否已加载完全部数据
                data: []
            };
            model['guess-list'] = {
                index: 0,
                action: 60003,
                pulluprefresh: null,  // 上拉加载实例
                pullupelem: null,   // 当前上拉加载元素
                isEnd: false,
                data: []
            };
            model['arrived-list'] = {
                index: 0,
                action: 60004,
                pulluprefresh: null,  // 上拉加载实例
                pullupelem: null,   // 当前上拉加载元素
                isEnd: false,  // 是否已加载完全部数据
                data: []
            };
        },
        // 渲染视图
        render (selector, data) {
            // 通过判断页数是否为0 来控制视图渲染操作
            if (!model[selector].index)  // .html
                $('.' + selector + ' ul').html( recommand_songlist_view({list: data.songs, selector: selector, defaultImg: defaultImg, isRoom: model.isRoom}) );
            else  // .append
               $('.' + selector + ' ul').append( recommand_songlist_view({list: data.songs, selector: selector, defaultImg: defaultImg, isRoom: model.isRoom}) ); 
        },
        // 绑定事件
        bindEvent () {
            // 点击歌曲整行
            this.linkToFanChang();
            // 点击演唱按钮
            this.linkToRecorder();
        },
        // 切换列表视图
        switchListView (index) {
            // 切换列表显示内容
            switch (index) {
                case 0:  // 热唱排行
                    model.currType = 0;
                    model.currSelector = 'hot-list';
                    break;
                case 1:  // 猜你喜欢
                    model.currType = 1;
                    model.currSelector = 'guess-list';
                    break;
                case 2:  // 新歌发布
                    model.currType = 2;
                    model.currSelector = 'arrived-list';
                    break;
            }
            // 首次请求数据列表
            if (!model[model.currSelector].index) {
                // 显示正在加载样式
                this.toggleLoadingState('show');
                // 请求数据
                this.requestListData(model.currType, 1);  // 已有数据显示，则不再请求
            }
            else {
                // 重新绑定pull-up-refresh操作
                this.pullUpRefreshHandler();
            }
            // 显示当前列表视图
            $('.' + model.currSelector).show().siblings('.recsong-list').hide();
            $('.recsong-nav-item').eq(index).addClass('current').siblings().removeClass('current');
        },
        // 更新模型
        updateModel (key, data) {
            // 首次加载不触发scroll事件
            if(model[key].index && data.length >= model.rows) {
                // 触发上拉加载重新绑定scroll事件
                model[model.currSelector].pulluprefresh.scroll();
            }
            // 已加载完全部数据
            if(data.length < model.rows) {
                model[model.currSelector].isEnd = true;   // 防止在切换导航后再次执行请求数据
            }
            model[key].data = model[key].data.concat(data);
            // 数据页数叠加
            model[key].index += data.length;

        },
        // 请求列表数据
        requestListData (type, isFirst) {
            var _this = this;


            // 已加载完全部数据，防止导航切换后，滑到最后再次去请求数据
            if (model[model.currSelector].isEnd) return;
            
            // 显示当前上拉加载元素
            if (isFirst !== 1) model[model.currSelector].pullupelem.show();

            // 请求数据
            var options = {
                url: config.protocol + config.domain + '/sod?action=' + model[model.currSelector].action,
                // offline: true,
                data: {
                    beginIndex: model[model.currSelector].index,
                    rows: model.rows,
                    userID: model.userID || 7851990
                },
                success (data) {
                    if (data.retCode == 1000) {
                        // 隐藏正在加载样式
                        _this.toggleLoadingState('hide');
                        // 渲染视图
                        _this.render(model.currSelector, data);
                        // 更新数据模型
                        _this.updateModel(model.currSelector, data.songs);
                        // 绑定点击事件
                        _this.bindEvent();
                        // 首次加载后执行pull-up-refresh操作
                        if (isFirst === 1) {
                            // 插入pull-up-refresh视图
                            if (!$('.' + model.currSelector + ' .pull-up-loading-wrapper')[0]) {
                                $('.' + model.currSelector).append(loading_view());
                            }
                            // pull-up-refresh操作
                            _this.pullUpRefreshHandler();
                            // 缓存数据
                            localStorage.setItem('vvmusic_index_recsong_' + type, JSON.stringify(data));
                        }
                        // 隐藏上拉加载元素
                        setTimeout(function () {
                            model[model.currSelector].pullupelem.hide();
                        }, 0);
                    }
                },
                error () {
                    // 从缓存读取数据
                    var data = localStorage.getItem('vvmusic_index_recsong_' + type);
                    if (data) {
                        // 渲染视图
                        _this.render(model.currSelector, JSON.parse(data));
                        // 更新数据模型
                        _this.updateModel(model.currSelector, JSON.parse(data).songs);
                        // 绑定点击事件
                        _this.bindEvent();
                    }
                }
            };
            fetch.http(options);
        },
        // pull-up-refresh操作
        pullUpRefreshHandler () {
            var _this = this;
            // 上拉加载元素
            model[model.currSelector].pullupelem = $('.' + model.currSelector + ' .pull-up-loading');

            // 上拉加载事件绑定
            model[model.currSelector].pulluprefresh = pullUpRefresh('.' + model.currSelector + ' .pull-up-loading-wrapper', {
                onRefresh () {
                    // 触发加载更多操作
                    _this.requestListData(model.currType);
                }
            });

        },
        // 跳转翻唱者列表页
        linkToFanChang () {
            $('.recsong-list li').off('tap').on('tap', function (e) {
                var index = $(this).index();
                var key = $(this).attr('data-selector');

                if (!model.isRoom) {
                    fetch.native('gotoFanChang', {msg: $(this).attr('data-songID')});
                } else {
                    fetch.native('downloadSong', {
                        msg: JSON.stringify({addtional: {external: [], func: 0, funcInfo:''}, songInfo: model[key].data[index]})
                    });
                }
            });
        },
        // 跳转录歌页
        linkToRecorder () {
            $('.recsong-btn').off('tap').on('tap', function (e) {
                e.stopPropagation();
                var index = $(this).parents('li').index();
                var key = $(this).attr('data-selector');

                if (!model.isRoom) {
                    // 跳转录歌页
                    fetch.native('gotoRecorder', model[key].data[index]);
                } else {
                    fetch.native('downloadSong', {
                        msg: JSON.stringify({addtional: {external: [], func: 0, funcInfo:''}, songInfo: model[key].data[index]})
                    });
                }
            })
        },
        // 切换列表数据正在加载样式
        toggleLoadingState (status) {
            if (status === 'show') {
                // 显示正在加载样式
                $('.recsong-loading-box').css({
                    visibility: 'visible',
                    height: module_data.height + 'px',
                    lineHeight: module_data.height + 'px',
                });
            }
            else {
                // 隐藏正在加载样式
                $('.recsong-loading-box').css({
                    visibility: 'hidden'
                });
            }
        }
    };
})();

module.exports = recommand_songlist;