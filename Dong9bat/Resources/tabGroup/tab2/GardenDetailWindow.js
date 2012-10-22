var win = Ti.UI.currentWindow;
// 헤더 타이틀 설정
Ti.include("/tabGroup/tab2/DetailHeader.js");

// 컨텐츠 테이블 뷰
var tableView = Ti.UI.createTableView({
	height : 480-28-36,
	//separatorColor : '#d3c1b2',
	separatorStyle: Ti.UI.iPhone.TableViewSeparatorStyle.NONE,
	minRowHeight : 60,
	zIndex : 10,
	backgroundImage : '/images/crops/detail/page_back.png',
	editable : true
});

Ti.include("/tabGroup/tab2/DetailTopView.js");
Ti.include("/tabGroup/tab2/DetailContentView.js");


setContentView(tableView, [{
	content : "동구밭에 오신걸 환영합니다.",
	contentType : 1,
	pubDate : new Date().getTime()
}], false);

tableView.addEventListener("delete", function(e){
	Ti.App.fireEvent("DELETE_GARDEN_HISTORY", {historyId: e.rowData.rowId});
});
win.add(tableView);

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
