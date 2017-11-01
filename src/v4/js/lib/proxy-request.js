// 引入协议命令体
var command = require('./protocol');
// 引入网络状态处理模块
var noNetwork = require('./network');
// 引入解析url参数模块
var getParameter = require('./getParameter');



// 创建单例
var instance = null;

// 定义代理请求类（本类为一个单例，只会实例化一次）
var Fetch = function () {
    var _this = this;
    // 是否为prompt协议
    this.isprompt = false;
    // 验证是否是从房间进入
    this.isRoom = (getParameter('copyright') == 'down');
    // 生成随机回调函数名称
    this.getCallbackName = function () {
        return 'requestHandler' + String( Math.random() ).replace(/\D/g, '');
    };
    // 回调函数名
    this.callbackName = this.getCallbackName();
    // 客户端调用回调函数
    window.onGetContext = function(ret, server_return, callback){
        setTimeout(function() {
            callback(ret, server_return);
        }, 10);
    }
    // 载入客户端回调网络状态
    if (window.javaDelegate) {
        this.network = window.javaDelegate.networkStatus();
        window.onNetworkChanged = function (state) {
            _this.network = state;
        }
    } else {
        this.network = true;
    }
};

// 设置HTTP参数
Fetch.prototype.setHTTPParameter = function (opts) {
    this.url = opts.url || ''; // url只可填action参数，其余参数放入data属性
    this.data = (opts.data && JSON.stringify(opts.data) || opts.data);
    this.success = opts.success || function () {};
    this.error = opts.error || function () {};
}
// 设置native参数
Fetch.prototype.setNativeParameter = function (args) {
    var command_name = args[0];
    
    if (!command_name) throw new Error('未传入协议名');
    
    if (!args[1]) this.data = null;

    // 传入的第二个参数为对象
    if (args[1] && typeof args[1] === 'object') {
        this.data = args[1];
        this.success = args[2] || function () {};
        this.error = args[3] || function () {};
    }
    // 传入的第二个参数为函数
    else if (args[1] && typeof args[1] === 'function') {
        this.data = null;
        this.success = args[1];
        this.error = args[2] || function () {};
    }

    if (!command[command_name]) throw new Error('没有该客户端协议');

    // 命令有中prompt字段为true时
    if (command[command_name].prompt) {
        this.isprompt = true;
        // 从房间进入  fe_source: (来源：0 - 首页，1 - 房间)
        if (this.isRoom && this.data) {
            this.data.fe_source = 1;
        }
        this.url = command[command_name].url(this.data || {});
    }
    // 命令有query字段
    else if (command[command_name].query) {
        this.isprompt = false;
        this.url = command[command_name].url + command[command_name].query(this.data)
    }
    else {
        this.isprompt = false;
        this.url = command[command_name].url;
    }
}

// 客户端协议请求
Fetch.prototype.nativeRequest = function (args) {
    // 获取网络状态
    if (!this.network) {
        // 没有传{offline: true}参数的都走无网提示流程
        if (args[1] && !args[1].offline) {
            noNetwork();
            return;
        }
    }
    // 设置native参数
    this.setNativeParameter(args);

    this.setCallback('native');
    this.request_native();
}

// 网络请求
Fetch.prototype.networkRequest = function (opts) {
    // 获取网络状态
    if (!this.network) {
        noNetwork();
        // 无网是否可以跳过
        if (opts.offline) {
            return;
        }
    }
    // 设置http代理请求参数
    this.setHTTPParameter(opts);

    if (!this.url) throw new Error('未传入url参数');

    this.setCallback('http');
    this.request_http();
}

// 设置处理回调函数
Fetch.prototype.setCallback = function (type) {
    var _this = this;
    this.callbackName = this.getCallbackName();
    // 创建临时全局变量
    window[ this.callbackName ] = function (ret, server_return) {
        var data = '';
        if (ret == 1) {
            data = server_return.replace(/\n/g, '');
            _this.success( JSON.parse( data ) );
        } else {
            _this.error();
        }
        // 执行后需销毁回调 释放内存
        _this.destory(_this.callbackName);
    }
}

// 拼接http代理请求参数
Fetch.prototype.query_http = function () {
    if (this.data) {
        return '&parameter=&parameter=' + this.data + '&callback=window.onGetContext&callbackp=' + this.callbackName;
    } else {
        return '&parameter=&callback=window.onGetContext&callbackp=' + this.callbackName;
    }
}
// 拼接客户端请求参数
Fetch.prototype.query_native = function () {
    if (/\?/g.test(this.url)) {
        return '&callback=window.onGetContext&callbackp=' + this.callbackName;
    } else {
        return '?callback=window.onGetContext&callbackp=' + this.callbackName;
    }
}

// 发送请求 - native
Fetch.prototype.request_native = function () {
    var ua = navigator.userAgent,
        url = '',
        msg = this.data ? (this.data.msg || null) : null;

    // vv音乐内操作
    if (/vvmusic/gi.test(ua)) {
        // 拼接为最终的url
        url = this.url + this.query_native();

        // 非prompt协议
        if (!this.isprompt) {
            // 执行跳转
            location.href = url;
        }
        // prompt协议
        else {
            prompt(msg, this.url);
        }
    }
    // 浏览器中操作
    else {
        // 非prompt协议
        if (!this.isprompt) {
            if (/openwebpage/gi.test(this.url)) {
                location.href = this.data.url;
            } else {
                window[this.callbackName](1, '{}');
            }
        }
        // prompt协议
        else {
            prompt(msg, this.url);
        }
    }
}

// 发送请求 - http
Fetch.prototype.request_http = function () {
    var ua = navigator.userAgent,
        url = '';

    // vv音乐内操作
    if (/vvmusic/gi.test(ua)) {
        // 拼接为最终的url
        url = 'vvmusicweb://setRequest?url=' + this.url + this.query_http();
        // 执行跳转
        location.href = url;
    }
    // 浏览器中操作
    else {
        // 拼接为最终的url
        url = this.url + ( (this.data && '&parameter=' + this.data) || '' );
        // 执行ajax
        $.ajax({
            url: url,
            dataType: 'json',
            success: this.success,
            error: this.error
        });
    }
}

// 空闲时间销毁回调，释放内存（不可立即销毁，否则手机上会出现无法加载数据的问题）
Fetch.prototype.destory = function (callbackName) {
    setTimeout(function() {
        window[callbackName] = null;
    }, 5000);
}

// 实例化代理请求类
var getInstance = function () {
    if (!instance) {
        instance = new Fetch();
    }

    return instance;
};

// 暴露调用接口
module.exports = {
    http (options) {
        var fetch = getInstance();
        fetch.networkRequest(options);
    },
    native () {
        var fetch = getInstance();
        fetch.nativeRequest(Array.prototype.slice.call(arguments));
    }
};