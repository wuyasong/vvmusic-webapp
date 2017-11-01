// 解析url参数
module.exports = function parseParam (key) {
	var param = window.location.search.slice(1);
	var arr_param = param.split('&');

	for (var i = 0; i < arr_param.length; i++) {
		var paramEq = arr_param[i].split('=');
		if (paramEq[0] == key) {
			return paramEq[1].replace(/#.*$/g, '');
		}
	}

	return '';
}