var win = Ti.UI.currentWindow;

// 헤더 타이틀 설정
require("tabGroup/tab2/DetailHeader").set(win);

var scrollView = Ti.UI.createScrollView({
	top : 0,
	//height : 460,
	width : 320,
	zIndex:10,
	showVerticalScrollIndicator : true,
	showHorizontalScrollIndicator : false
	//contentWidth : 'auto',
	//contentHeight : 'auto'
});
// 뒷배경 뷰~
var view = Ti.UI.createView({
	top : 0,
	height : 'auto',
	width : 320,
	borderWidth : 1,
	borderColor : "red",
	zIndex:10
	//backgroundColor: "blue",
	//layout:"vertical"
	//opacity: 0.5
});

var bgimage = require("tabGroup/tab2/DetailBgImage");
bgimage.setBGView(win, view, scrollView);

// 텃밭 사진
var photo = Ti.UI.createView({
	backgroundImage : '/images/garden/crop_back.png',
	top : 84,
	left : 8,
	width : 68,
	height : 68,
	zIndex : 1,
	clickName : 'photo'
});
view.add(photo);

// 작물 이름
var title = Ti.UI.createLabel({
	color : '#FFF',
	zIndex : 1,
	font : {
		fontSize : '13',
		fontWeight : 'bold',
		fontFamily : 'NanumGothic'
	},
	left : 84,
	top : 136,
	textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
	height : 'auto',
	width : 200,
	clickName : 'title',
	text : '토마토 텃밭'
});
view.add(title);

// 새로 고침 버튼
var refreshBtn = Ti.UI.createButton({
	backgroundImage : '/images/garden/detail/refresh.png',
	backgroundSelectedImage : '/images/garden/detail/refresh_selected.png',
	top : 130,
	right : 40,
	zIndex : 1,
	width : 31,
	height : 31
});
refreshBtn.addEventListener("click", function(e) {

});

view.add(refreshBtn);

// 글쓰기 버튼 
var postBtn = Ti.UI.createButton({
	backgroundImage : '/images/garden/detail/post.png',
	backgroundSelectedImage : '/images/garden/detail/post_selected.png',
	top : 130,
	right : 8,
	width : 31,
	zIndex : 1,
	height : 31
});
view.add(postBtn);

require("tabGroup/tab2/DetailContent").setTable(win, view);

// Add to the parent view.

scrollView.add(view);
win.add(scrollView);

