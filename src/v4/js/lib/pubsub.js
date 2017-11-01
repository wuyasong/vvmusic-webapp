var PubSub = (function () {
    return {
        // 缓存订阅者列表
        cacheList: [],
        // 发布消息
        publish () {
            // 获取消息键名
            var key = Array.prototype.shift.call(arguments);
            // 获取消息对应的回调函数列表
            var callbackList = this.cacheList[key];

            // 没有订阅者，则退出
            if(!callbackList || callbackList.length === 0) return false;

            // 遍历订阅者的回调函数列表， 有则触发
            for (var i = 0; i < callbackList.length; i++) {
                callbackList[i].apply(this, arguments);
            }
        },
        // 增加订阅者
        subscribe (key, callback) {
            // 为订阅者创建回调函数列表
            if (!this.cacheList[key]) {
                this.cacheList[key] = [];
            }
            // 添加到订阅者的回调函数列表
            this.cacheList[key].push(callback);
        },
        // 取消订阅
        unsubscribe (key, callback) {
            // 获取消息对应的回调函数列表
            var callbackList = this.cacheList[key];

            // 没有订阅者，则退出
            if (!callbackList) return false;

            // 没有传第二个参数则取消改订阅者的所有订阅
            if (!callback) {
                callbackList && (callbackList.length = 0);
            } else {
                for (var i = 0; i < callbackList.length; i++) {
                    if (callbackList[i] === callback) {
                        callbackList.splice(i, 1);  // 删除订阅者回调函数
                    }
                }  
            }
        }
    }
})();

module.exports = PubSub;