var win = Ti.UI.currentWindow;
// 헤더 타이틀 설정
require("tabGroup/tab2/DetailHeader").set(win);

var scrollView = Ti.UI.createScrollView({
	top : 0,
	width : 320,
	zIndex : 10,
	layout: "vertical",
	showVerticalScrollIndicator : true,
	showHorizontalScrollIndicator : false
});
// 뒷배경 뷰~
var view = Ti.UI.createView({
	height : Ti.UI.SIZE,
	layout: "vertical",
	width : 320,
	zIndex : 10
});

require("tabGroup/tab2/DetailTopView").setTopView(win, view, scrollView);
require("tabGroup/tab2/DetailContentView").setContentView(win, view);


scrollView.add(view);
win.add(scrollView);

