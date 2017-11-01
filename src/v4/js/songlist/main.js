// 引入歌单样式
require('../../scss/pages/songlist.scss');

// 引入业务模块
var songlist = require('./components/songlist');  // 轮播图

$('.container').show();
// 歌曲列表操作
songlist.init();
