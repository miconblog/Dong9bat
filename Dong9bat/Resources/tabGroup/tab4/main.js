Ti.include("/util/util.js");
var win = Ti.UI.currentWindow;

var add = Ti.UI.createButton({
	title : "추가",
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
add.addEventListener('click', function(e) {

	var childWin = Ti.UI.createWindow({
		title : '할일 등록',
		modal : true,
		backgroundColor : '#ccc',
		url : '/windows/TodoForm.js'
	});
	childWin.open();
});
win.rightNavButton = add;

// Create a TableView.
var tableView = Ti.UI.createTableView({
	editable : true,
	moveable : true,
	minRowHeight: 60,
	backgroundColor : "transparent",
	backgroundImage : '/images/crops/detail/page_back.png',
	separatorColor : '#999'
});

// tableView.addEventListener('click', function(e) {
// alert('title: \'' + e.row.title + '\', section: \'' + e.section.headerTitle + '\', index: ' + e.index);
// });

tableView.addEventListener('delete', function(e) {
	Ti.App.fireEvent('DELETE_TODO', {
		todoId : e.rowData.data.todoId
	})
});

win.add(tableView);

win.addEventListener("focus", function() {
	Ti.App.fireEvent("LOAD_TODOS");
});

Ti.App.addEventListener("DRAW_TODOS", function(e) {
	var data = e.data;
	var rows = [];
	var sections = [];

	var bImportant = false;
	var bNormal = false;
	var bComplete = false;

	for (var i = 0; i < data.length; ++i) {

		var row = Ti.UI.createTableViewRow({
			className : 'todo-row',
			height : Ti.UI.SIZE,
			data : data[i]
		});

		var verticalView = Ti.UI.createView({
			width : 226,
			height : Ti.UI.SIZE,
			left : 52,
			layout : "vertical"
		});

		var contentView = Ti.UI.createView({
			height : Ti.UI.SIZE,
			layout : "horizontal"
		});

		var expireView = Ti.UI.createView({
			height : 30,
			layout : "horizontal"
		});

		if (!bImportant && data[i].important > 0) {
			bImportant = true;
			row.header = "중요한 일";
		}

		if (!bNormal && data[i].important == 0) {
			bImportant = true;
			bNormal = true;
			row.header = "해야할 일";
		}

		if (!bComplete && data[i].complete > 0) {
			bImportant = true;
			bNormal = true;
			bComplete = true;
			row.header = "완료";
		}

		// 할일 제목
		var lbTitle = Ti.UI.createLabel({
			text : data[i].title,
			top : 10,
			font : {
				fontFamily : "NanumGothic",
				fontWeight : "bold"
			},
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			color : '#6d2c00',
			height: Ti.UI.SIZE,
			width : Ti.UI.SIZE
		});

		// 텃밭이름
		var sName = "("+data[i].gardenName+")";
		if( data[i].gardenId.indexOf("g")>-1 && !data[i].gardenName){
			sName = "(삭제된 텃밭)";
		}else if(data[i].gardenName == 0){
			sName = "";
		}
		var lbGardenName = Ti.UI.createLabel({
			top : 10,
			text : sName,
			font : {
				fontFamily : "NanumGothic",
				fontSize : 12
			},
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			color : '#6d2c00',
		});

		// 미션 기간
		var sExpire = (data[i].expire) ?  "미션기간: " + getLocalDate(data[i].expire) + "까지" : "날짜 지정 없음";
		var lbExpire = Ti.UI.createLabel({
			text : sExpire,
			font : {
				fontFamily : "NanumGothic",
				fontSize : 11
			},
			left : 0,
			bottom : 10
		});

		// 중요 버튼
		var btnImportant = Ti.UI.createButton({
			clickName : "important",
			width : 32,
			height : 32,
			left : 278,
			backgroundImage : "/images/ui/Favorites/" + ((data[i].important ) ? "on" : "off") + ".png"

		});

		// 완료 버튼
		if( data[i].complete ){
			row.editable = true;
		}else{
			row.editable = false;
		}
		var btnComplete = Ti.UI.createButton({
			clickName : "complete",
			left : 10,
			width : 32,
			height : 32,
			backgroundImage : "/images/ui/CheckBox/checkbox_" + ((data[i].complete ) ? "full" : "empty") + ".png"
		});

		// 레이아웃
		contentView.add(lbTitle);
		contentView.add(lbGardenName);
		expireView.add(lbExpire);
		verticalView.add(contentView);
		verticalView.add(expireView);
		row.add(btnImportant);
		row.add(verticalView);
		row.add(btnComplete);

		// 이벤트
		row.addEventListener("click", function(e) {
			switch(e.source.clickName) {
				case "important":
					Ti.App.fireEvent("UPDATE_TODO_IMPORTANT", {
						todoId : e.rowData.data.todoId,
						value : !e.rowData.data.important
					});
					break;

				case "complete":
					Ti.App.fireEvent("UPDATE_TODO_COMPLETE", {
						gardenId: e.rowData.data.gardenId,
						todoId : e.rowData.data.todoId,
						value : !e.rowData.data.complete
					});
					break;
			}

		});
		
		rows.push(row);
	}

	tableView.setData(rows);

});
