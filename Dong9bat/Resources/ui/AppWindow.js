/**
 * 동구밭 기본 스타일 윈도우를 생성하는 클래스 
 * @param {Object} windowOptions
 * @param {Object} _data
 */
function AppWindow(windowOptions, _data) {
	
	windowOptions.barImage = "/images/title_bg.png";
	//prop.backgroundImage = "";
	windowOptions.backgroundColor = "#FFF";
	windowOptions.data = _data;
	return Ti.UI.createWindow(windowOptions);
};
module.exports = AppWindow;
