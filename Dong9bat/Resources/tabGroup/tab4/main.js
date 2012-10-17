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
	
	for (var i = 0; i < data.length; ++i) {

		var row = Ti.UI.createTableViewRow({
			className 	: 'todo-row',
			height 		: 60,
			data		: data[i]
		});
		
		var contentView = Ti.UI.createView({
			width	: 226,
			left	: 52,
			top		: 10,
			layout	: "horizontal"
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
		
		// 할일 제목
		var lbTitle = Ti.UI.createLabel({
			text : data[i].title,
			font : {
				fontFamily : "NanumGothic",
				fontWeight : "bold"
			},
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			color : '#6d2c00',
			width : Ti.UI.SIZE,
		});
		
		var lbSubTitle = Ti.UI.createLabel({
			text : "("+data[i].gardenName +")",
			font : {
				fontFamily : "NanumGothic",
				fontSize : 12
			},
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			color : '#6d2c00',
		});
		
		
		// 중요 버튼 
		var btnImportant = Ti.UI.createButton({
			clickName	: "important",
			width		: 32,
			height		: 32,
			right		: 10,
			backgroundImage: "/images/ui/Favorites/"+ (( data[i].important )? "on":"off") +".png"
			
		});
		
		// 완료 버튼 
		var btnComplete = Ti.UI.createButton({
			clickName	: "complete",
			value 		: data[i].completed,
			left		: 10,
			width		: 32,
			height		: 32,
			backgroundImage: "/images/ui/CheckBox/checkbox_"+ (( data[i].completed )? "full":"empty") +".png"
		});
		
		contentView.add(lbTitle);
		contentView.add(lbSubTitle);
		row.add(btnImportant);
		row.add(contentView);
		row.add(btnComplete);
		
		row.addEventListener("click", function(e){	
			switch(e.source.clickName){
				case "important":
					console.log("중요 버튼 클릭!", e.rowData.data );
					Ti.App.fireEvent("UPDATE_TODO_IMPORTANT", {todoId: e.rowData.data.todoId, value: !e.rowData.data.important});
				
				break;
				case "complete":
				break;
			}
			
		});
		

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
