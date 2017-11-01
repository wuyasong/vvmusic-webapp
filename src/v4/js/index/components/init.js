module.exports = function (isRoom) {
	var default_height = window.innerHeight - document.querySelector('.recsong-loading-box').getBoundingClientRect().top;
	module_data.height = default_height;
	// 设置默认列表区域高度
	$('.recsong-loading-box').css({
		// visibility: 'visible',
		height: default_height + 'px',
		lineHeight: default_height + 'px',
	});

	// 若为房间进入
	if (isRoom) {
		$('.carrousel').hide();
		$('.guide').hide();
	}

	$('.container').show();
};