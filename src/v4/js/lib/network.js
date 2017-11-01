// 引入弹层模块
var dialog = require('./dialog');

module.exports = function () {
    dialog.show('.no-network');

    setTimeout(function() {
        dialog.hide('.no-network');
    }, 1000);
};