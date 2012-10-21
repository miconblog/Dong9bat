Ti.include("/util/util.js");
var db = require('db');

// 일단 무조건 텃밭 목록을 가져온다.
Ti.App.Properties.setBool("isUpdated", true);

Ti.App.addEventListener("TAB_WINDOW_OPENED", function(e) {
	var data = db.get24CalendarInfo();
	Ti.App.fireEvent("UPDATE_CALENDAR", {
		text : data.name
	});
});

/**
 * 작물 바로 심기 이벤트
 *  - 뱃지에 N 표시 추가
 *  - 작물 탭으로 바로 이동
 *  - 진동 추가
 */
Ti.App.addEventListener("ADD_CROP_TO_GARDEN", function(e) {
	// DB 저장하고, 나중에 화면에 그릴때를 위해서 변경할 것을 체크해둔다.
	var gardenId = "g"+ new Date().getTime();
	Ti.App.Properties.setBool("isUpdated", true);
	
	db.addGarden(gardenId, e.cropId, e.name, e.period);
	
	Ti.App.fireEvent("ADD_MISSION_TO_TODOS", {gardenId:gardenId, cropId:e.cropId, day:e.day});
	
	Ti.Media.vibrate();
	Ti.App.fireEvent("DRAW_NEW_BADGE_ON_GARDEN");
	Ti.App.fireEvent("DRAW_NEW_BADGE_ON_TODOS");
});

Ti.App.addEventListener("SELECT_TAB_BUTTON", function(e) {
	if (Ti.App.currentTabIndex == e.index) {
		if (e.index == 0) {
			Ti.App.fireEvent("CLOSE_CROP_SELECT_WINDOW");
		}
	} else {
		oTabGroup.setActiveTab(e.index);
	}

	// 텃밭 목록일 경우, 업데이트 된 목록이 있으면 업데이트 한다.
	if (e.index == 1 && Ti.App.Properties.getBool("isUpdated")) {
		Ti.App.Properties.setBool("isUpdated", false);
		Ti.App.fireEvent("UPDATE_GARDEN_LIST");
	}

	Ti.App.currentTabIndex = e.index;
});

/**
 * 텃밭 목록을 업데이트 한다.
 * 1. 텃밭 정보를 가져와서,
 * 2. 텃밭에 있는 작물 정보도 같이 가져온다.
 */
Ti.App.addEventListener("UPDATE_GARDEN_LIST", function() {
	var _data = db.getAllGardens();
	for (var i = 0; i < _data.length; ++i) {
		_data[i].cropInfo = db.getCropInfo(_data[i].cropId);
	}

	console.log("텃밭 목록: ", _data);
	Ti.App.fireEvent("DRAW_GARDEN_LIST", {
		data : _data
	});
});

Ti.App.addEventListener("LOAD_GARDEN_LIST", function(){
	var _data = db.getAllGardens();

	Ti.App.fireEvent("DRAW_GARDEN_LIST_FOR_SELECT", {
		data : _data
	});
});


/**
 * 텃밭 목록의 순서를 변경한다.
 */
Ti.App.addEventListener("UPDATE_GARDEN_ORDERING", function(e) {
	//	Ti.API.info(['UPDATE_GARDEN_ORDERING', e]);
	db.updateGardenOrdering(e.gardenId, e.from, e.to);
});

/**
 * 텃밭을 삭제한다.
 */
Ti.App.addEventListener("DELETE_GARDEN", function(e) {
	Ti.API.info(['DELETE_GARDEN', e]);
	db.deleteGarden(e.gardenId);
});

/**
 * 텃밭에 배경이미지를 DB에 저장한다.
 */
Ti.App.addEventListener("SAVE_TO_DB_GARDEN_BG_IMAGE", function(e) {
	db.setGardenBackgoundImage(e.rowId, e.image);
});

/**
 * 해당 텃밭을 DB에서 지운다.
 */
Ti.App.addEventListener("DELETE_GARDEN_FROM_DB", function(e) {
	db.delectGarden(e.rowId);
});

/**
 * 텃밭 이름 변경
 */
Ti.App.addEventListener("UPDATE_GARDEN_NAME", function(e) {
	Ti.App.Properties.setBool("isUpdated", true);
	db.updeateGardenName(e.gardenId, e.name);
});

/**
 * 텃밭 상세 배경 이미지 저장
 */
Ti.App.addEventListener("SAVE_BG_IMAGE_FILE", function(e) {
	Ti.App.Properties.setBool("isUpdated", true);
	db.updeateGardenImage(e.gardenId, e.path);
	//Ti.App.fireEvent("UPDATE_GARDEN_LIST");
	
});


/**
 * 절기 달력 정보 로드
 */
Ti.App.addEventListener("UPDATE_THIS_MONTH_INFO", function(e) {
	var data = db.get24CalendarInfo();
	var has24cal = true;

	if (!data.name) {
		data = db.get24CalendarInfoByMonth();
		has24cal = false;
	}

	Ti.App.fireEvent("DRAW_THIS_MONTH_INFO", {
		data : db.getThisMonthInfo(),
		info : data,
		has24cal : has24cal
	})
});

/**
 * 데이터 베이스 업데이트
 */
Ti.App.addEventListener("UPDATE_DATA_BASE", function(e) {
	db.updateDb(e);
});

Ti.App.addEventListener("LOAD_CROPS", function() {
	var crops = db.getAllCrops();

	var stepName = ["씨뿌리기", "모종키우기", "모종옮겨심기", "논밭키우기", "수확하기", "휴농기"];
	for (var i = 0; i < crops.length; ++i) {
		var step = db.getPlantPeriodStep(crops[i].cropId);
		crops[i].step = step;
		crops[i].stepName = stepName[step];
	}

	Ti.App.fireEvent("DRAW_ALL_CROPS", {
		data : crops
	});
});

Ti.App.addEventListener("LOAD_CROP_INFO", function(e) {
	var cropInfo = db.getCropInfo(e.cropId);
	var stepName = ["씨뿌리기", "모종키우기", "모종옮겨심기", "논밭키우기", "수확하기", "휴농기"];
	var step = db.getPlantPeriodStep(e.cropId);
	cropInfo.step = step;
	cropInfo.stepName = stepName[step];

	Ti.App.fireEvent("DRAW_CROP_DETAIL", {
		data : cropInfo
	});
});

/**
 * 작물 추가시 할일 자동 등록  
 */
Ti.App.addEventListener("ADD_MISSION_TO_TODOS", function(e){
	var data = db.getCropMissionByDay(e.cropId, e.day);
	
	for(var i=0; i < data.length; ++i){
		console.log("할일 검색", e.gardenId, data[i]);
		db.addTodo(e.gardenId, data[i]);
	}
});


/**
 * 할일 업데이트  
 */
Ti.App.addEventListener("LOAD_TODOS", function(e){
	var data = db.getAllTodos();
	
	// 텃밭 아이디를 검색해서 이름을 가져와 붙인다. 
	for(var i=0; i<data.length; i++){
		var gardenId = data[i].gardenId || 0;
		data[i].gardenName = db.getGardenNameById(gardenId) || 0;
	}
	
	if( data.length > 0 ){
		console.log("할일 검색", data);
		Ti.App.fireEvent("DRAW_TODOS", {data: data});
	}	
});

/**
 * 할일 추가
 */
Ti.App.addEventListener("ADD_USER_TODOS", function(e){
	if( !!e.gardenId ) {
		// 텃밭 히스토리에도 삽입
		console.log("TODO: 텃밭 히스토리에도 삽입", e);
		//db.addGardenHistroy()
	}
	
	// 사용자 할일 추가
	db.addUserTodo(e);
	
});

/**
 * 할일 삭제
 */
Ti.App.addEventListener("DELETE_TODO", function(e) {
	db.deleteTodo(e.todoId);
});


/**
 * 할일의 중요도 변경
 * @param {Number} e.todoId
 * @param {Boolean} e.value 
 */
Ti.App.addEventListener("UPDATE_TODO_IMPORTANT", function(e){
	db.updateTodoImportant(e.todoId, e.value ? 1:0);
	Ti.App.fireEvent("LOAD_TODOS");
});

/**
 * 할일의 완료 여부 변경
 * @param {Number} e.todoId
 * @param {Boolean} e.value 
 */
Ti.App.addEventListener("UPDATE_TODO_COMPLETE", function(e){
	db.updateTodoComplete(e.todoId, e.value ? 1:0);
	Ti.App.fireEvent("LOAD_TODOS");
});

Ti.App.addEventListener("ADD_GARDEN_HISTORY", function(e){
	db.addGardenHistory(e.gardenId, e.note, 2);
	var data = db.getRecentGardenHistory(e.gardenId);
	Ti.App.fireEvent("UPDATE_GARDEN_HISTORY", {data: data});
});

Ti.App.addEventListener("DELETE_GARDEN_HISTORY", function(e){
	db.deleteGardenHistroy(e.historyId);
});

Ti.App.addEventListener("LOAD_GARDEN_DETAIL_CONTENT", function(e){
	var data = db.getGardenHistory(e.gardenId);
	Ti.App.fireEvent("DRAW_GARDEN_DETAIL_CONTENT", {data: data, rowData: e.data});
});

if (Ti.version < 1.8) {
	alert('Sorry - this application template requires Titanium Mobile SDK 1.8 or later');
} else if (Ti.Platform.osname === 'mobileweb') {
	alert('Mobile web is not yet supported by this template');
} else {
	
	// 일단 DB 인스톨..
	db.createDb();

	// 탭그룹 만들어 열면 작물 윈도우가 열린다.
	var oTabGroup = new (require('tabGroup/MainTabGroup'));
	
	if (Ti.Network.getOnline()) {
		getRemoteFile("dongu" + new Date().getTime() + ".db", "http://miconblog.com/sqlite/dongu.sqlite", function(end) {
			// indicator.hide();
			// win.remove(indicator);
			// indicator = null;

			if (end.error) {
				alert(end.error);
			} else {
				db.updateDb(end);
				oTabGroup.open();
			}
		}, function(progress) {
			console.log("진행중: ", progress);
		})
	} else {
		oTabGroup.open();
	}

	console.log("AppDataPath: ", Titanium.Filesystem.applicationDataDirectory);
	// Documents - iTunes와 공유되는 폴더
	console.log("AppPath: ", Titanium.Filesystem.applicationDirectory);
	// Applications - 애플리케이션 폴더
	console.log("AppCachePath: ", Titanium.Filesystem.applicationCacheDirectory);
	// Library/Caches - 설정이나 캐시등을 저장하는 폴더
	console.log("AppSupportPath: ", Titanium.Filesystem.applicationSupportDirectory);
	// Library/Application Support - iCloud 자동 백업된다. 이 앱이 다른 앱과 연동될때 필요한 데이터를 저장하는 폴더
	console.log("ResourcesPath: ", Titanium.Filesystem.resourcesDirectory);
	// [AppName.app] - 앱 리소스 폴더
	console.log("TempPath: ", Titanium.Filesystem.tempDirectory);
	// /tmp/ - 임시파일, 앱이 죽거나 재시작하면 없어진다.
}
