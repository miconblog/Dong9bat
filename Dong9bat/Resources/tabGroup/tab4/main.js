var win = Ti.UI.currentWindow;

var add = Ti.UI.createButton({
	systemButton : Titanium.UI.iPhone.SystemButton.ADD
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
	backgroundColor : "transparent",
	backgroundImage : '/images/crops/detail/page_back.png',
	separatorColor : '#999'
});

// // Populate the TableView data.
// var data = [{
	// title : '옮겨심기',
	// gardenTitle : '토마토 텃밭',
	// deadLine : '2012-06-30',
	// color : 'red',
	// header : '중요한 일'
// }, {
	// title : '벌레잡기',
	// gardenTitle : '토마토 텃밭',
	// deadLine : '2012-06-30',
	// hasDetail : true,
	// color : 'green'
// }, {
	// title : '웃거름 주기',
	// gardenTitle : '토마토 텃밭',
	// deadLine : '2012-06-30',
	// hasCheck : true,
	// color : 'blue',
	// header : '해야할 일'
// }, {
	// title : '솎아주기',
	// gardenTitle : '토마토 텃밭',
	// deadLine : '2012-06-30',
	// color : 'orange'
// }];

tableView.addEventListener('click', function(e) {
	alert('title: \'' + e.row.title + '\', section: \'' + e.section.headerTitle + '\', index: ' + e.index);
});

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
	
	for (var i = 0; i < data.length; ++i) {

		var row = Ti.UI.createTableViewRow({
			borderWidth : 2,
			borderColor : '#000',
			className 	: 'todo-row',
			height 		: 80,
			data		: data[i]
		});
		
		if(!bImportant && data[i].important > 0 ){
			bImportant = true;
			row.header = "중요한 일";
		}
		
		if(!bNormal && data[i].important == 0 ){
			bImportant = true;
			bNormal = true;
			row.header = "해야할 일";
		}
		
		var lbTitle = Ti.UI.createLabel({
			text : data[i].title,
			font : {
				fontFamily : "NanumGothic",
				fontWeight : "bold"
			},
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			color : '#6d2c00',
			left : 10,
			top : 2,
			height : 36
		});
		row.add(lbTitle);

		var lbSubTitle = Ti.UI.createLabel({
			text : "텃밭이름 넣어야함!!",
			font : {
				fontFamily : "NanumGothic",
				fontSize : 12
			},
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			color : '#6d2c00',
			left : 10,
			top : 42,
			height : 28
		});
		row.add(lbSubTitle);
		
		
		// 중요 버튼 
		var btnImportant = Ti.UI.createButton({
			title: "중요",
			right: 70
		});
		row.add(btnImportant);
		
		// 완료 버튼 
		var btnComplete = Ti.UI.createButton({
			title: "완료",
			right: 10
		});
		row.add(btnComplete);
		
		

		// if (data[i].header) {
			// var section = Ti.UI.createTableViewSection({
				// headerTitle : data[i].header + "!!",
				// borderWidth : 2,
				// borderColor : '#777'
			// });
// 
			// // var header = Ti.UI.createView({
			// // backgroundColor : '#999',
			// // height : 'auto'
			// // });
			// //
			// // var headerLabel = Ti.UI.createLabel({
			// // font : {
			// // fontFamily : 'Helvetica Neue',
			// // fontSize : 18,
			// // fontWeight : 'bold'
			// // },
			// // text : 'Custom Header - first label',
			// // color : '#222',
			// // textAlign : 'left',
			// // top : 0,
			// // left : 10,
			// // width : 300,
			// // height : 30
			// // });
			// // var headerLabel2 = Ti.UI.createLabel({
			// // font : {
			// // fontFamily : 'Helvetica Neue',
			// // fontSize : 18,
			// // fontWeight : 'bold'
			// // },
			// // text : 'Custom Header - second label',
			// // color : '#222',
			// // textAlign : 'left',
			// // left : 10,
			// // top : 50,
			// // width : 300,
			// // height : 30
			// // });
			// // header.add(headerLabel);
			// // header.add(headerLabel2);
			// //
			// // section.headerView = header;
			// section.add(row);
			// sections.push(section);
		// } else {
			// sections[sections.length - 1].add(row);
		// }
		rows.push(row);
	}

	tableView.setData(rows);

});
