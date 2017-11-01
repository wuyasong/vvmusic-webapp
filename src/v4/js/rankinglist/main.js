require('../../scss/pages/rankinglist.scss');

// 榜单模块
var rankinglist = require('./components/rankinglist.js');

// window.onerror = function (e) {
//     alert(e)
// }
$('.container').show();
// 榜单列表操作
rankinglist.init();