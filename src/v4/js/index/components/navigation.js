// 引入全局配置文件
var config = require('../../config');
// 引入client代理网络请求组件
var fetch = require('../../lib/proxy-request');

module.exports = {
    init (isRoom) {
        if (isRoom) {
            $('.navigation-item-chorus').hide()
            $('.navigation-item-cappella').hide()
            $('.navigation-item-local').hide()
            $('.navigation-item-mylist').hide();
        }
        this.linkTo(isRoom);
    },
    linkTo (isRoom) {
        $('.navigation-item').on('tap', function () {
            switch ( $(this).index() ) {
                case 0:
                    fetch.native('openWebPage', {title: '歌手', url: config.prefixUrl + '/singer/singer.html' + (isRoom ? '?copyright=down' : ''), offline: true});
                    break;
                case 1:
                    fetch.native('openWebPage', {title: '分类', url: config.prefixUrl + '/category/category.html' + (isRoom ? '?copyright=down' : ''), offline: true});
                    break;
                case 2:
                    fetch.native('openWebPage', {title: '歌单', url: config.prefixUrl + '/songlist/songlist.html' + (isRoom ? '?copyright=down' : ''), offline: true});
                    break;
                case 3:
                    fetch.native('openWebPage', {title: '榜单', url: config.prefixUrl + '/rankinglist/rankinglist.html' + (isRoom ? '?copyright=down' : ''), offline: true});
                    break;
                case 4:
                    fetch.native('gotoChorus', {offline: true});
                    break;
                case 5:
                    fetch.native('gotoCappella', {offline: true});
                    break;
                case 6:
                    fetch.native('gotoLocal', {offline: true});
                    break;
                case 7:
                    fetch.native('gotoMylist', {offline: true});
                    break;
            }
        });
    }
}