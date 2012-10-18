var win = Titanium.UI.currentWindow;
var AppWindow = require('/ui/AppWindow');
var dashboard = Titanium.UI.createDashboardView({
	data : [],
	width : 320,
	height : 370,
	top : 10
});
//view.add(dashboard);
win.add(dashboard);

var done = Ti.UI.createButton({
	title : "완료",
	width : 60,
	height : 30,
	font : {
		fontSize : '12',
		fontWeight : 'Bold',
		fontFamily : 'NanumGothic'
	},
	backgroundImage : '/images/button_edit.png',
	backgroundSelectedImage : '/images/button_edit_selected.png'
});

done.addEventListener('click', function() {
	dashboard.stopEditing();
	win.rightNavButton = null;
});

dashboard.addEventListener('edit', function() {
	win.rightNavButton = done;
});

/**
 * 작물 아이템을 클릭 했을때,
 *  - 달력 사라져야함!
 */
dashboard.addEventListener('click', function(e) {
	Ti.App.fireEvent("HIDE_MAIN_TAB_MENU");
	var winCrop = AppWindow({
		title : e.item.name,
		url : "/tabGroup/tab1/CropSelectWindow.js",
		backgroundImage : '/images/crops/detail/page_back.png',
	}, {
		cropId : e.item.id
	});
	Ti.UI.currentTab.open(winCrop);
});

Ti.App.addEventListener("DRAW_ALL_CROPS", function(e) {
	var crops = e.data;
	var data = [];
	var items = dashboard.getData();

	for (var i = 0; i < crops.length; i++) {

		// 조건부 업데이트
		var j, isUpdate = false;
		for ( j = 0; j < items.length; j++) {

			if (items[j].id == crops[i].cropId) {
				console.log("조건부 업데이트: ", crops[i].cropId, items[j].id);
				items[j].image = crops[i].icon;
				isUpdate = true;
				continue;
			}
		}

		if (!isUpdate) {

			console.log("새로 추가: ", crops[i].name);

			var item = Titanium.UI.createDashboardItem({
				image : crops[i].icon,
				canDelete : false,
				id : crops[i].cropId,
				name : crops[i].name
			});

			data.push(item);
		}

	}
	if (data.length > 0) {
		dashboard.setData(data);
	}

	console.log("작물 로드 완료!! :  ", crops, items);
});

/**
 * 윈도우가 열리면, 한번만 초기화
 */
win.addEventListener("focus", function(e) {
	Ti.App.fireEvent("LOAD_CROPS");
});

/**
 * 윈도우가 포커스를 받으면,..
 */
win.addEventListener("focus", function(e) {
	//Ti.API.info("윈도우 포커스");
	//Ti.App.fireEvent("SHOW_24CAL");

});

/**
 * 윈도우가 포커스를 잃으면,..
 */
win.addEventListener("blur", function(e) {
	//Ti.API.info("윈도우 포커스 아웃");

});

/**
 * 윈도우가 닫히면,
 */
win.addEventListener("close", function(e) {
	//	Ti.API.info("윈도우 클로즈");

});
