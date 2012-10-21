var win = Ti.UI.currentWindow;
// 헤더 타이틀 설정
Ti.include("/tabGroup/tab2/DetailHeader.js");
var scrollView = Ti.UI.createScrollView({
	top : 0,
	width : 320,
	zIndex : 10,
	layout : "vertical",
	showVerticalScrollIndicator : true,
	showHorizontalScrollIndicator : false
});
// 뒷배경 뷰~
var view = Ti.UI.createView({
	height : Ti.UI.SIZE,
	layout : "vertical",
	width : 320,
	zIndex : 10,
	data : []
});

Ti.include("/tabGroup/tab2/DetailTopView.js");
Ti.include("/tabGroup/tab2/DetailContentView.js");

// 컨텐츠 테이블 뷰
var tableView = Ti.UI.createTableView({
	height : 360,
	separatorColor : '#d3c1b2',
	minRowHeight : 60,
	zIndex : 10,
	backgroundImage : '/images/crops/detail/page_back.png',
	editable : true,
	scrollable : false
});
setContentView(tableView, [{
	title : "동구밭에 오신걸 환영합니다.",
	contentType : 1,
	pubDate : new Date().getTime()
}], false);

tableView.addEventListener("delete", function(e){
	Ti.App.fireEvent("DELETE_GARDEN_HISTORY", {historyId: e.rowData.rowId});
});
view.add(tableView);
scrollView.add(view);
win.add(scrollView);

Ti.App.addEventListener("DRAW_GARDEN_DETAIL_CONTENT", function(e) {
	console.log("텃밭 상세 정보", e.data);
	setContentView(tableView, e.data, true);
	
});

Ti.App.addEventListener("UPDATE_GARDEN_HISTORY", function(e){
	refreshBtn.fireEvent("click");
	setContentView(tableView, e.data, false);
});

win.addEventListener("open", function() {
	Ti.App.fireEvent("LOAD_GARDEN_DETAIL_CONTENT", {
		gardenId : win.data.gardenId
	});
});
