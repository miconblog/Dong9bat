Ti.include("/util/util.js");
var win = Ti.UI.currentWindow;
// Create a TableView.
var tableView = Ti.UI.createTableView({
	style : Ti.UI.iPhone.TableViewStyle.GROUPED,
	height : 380,
	top : 0
});

// Add to the parent view.
win.add(tableView);

Ti.App.addEventListener("DRAW_THIS_MONTH_INFO", function(e) {

	var rows = [];
	var row = Ti.UI.createTableViewRow();
	if (e.has24cal) {// 24절기에 해당하는 날
		row.header = "오늘은 " + e.info.name + "입니다.";
		var calView = new (require("/ui/AutoHeightView"))(e.info.content);
		row.add(calView);
	} else {// 24절기가 아니면, 해당 월에 있는 절기
		row.header = e.data.month + "월의 절기";
		var strData="";
		for (var i = 0; i < e.info.length; ++i) {

			strData += e.info[i].name + "(" + e.info[i].date + ")  ";

		}
		var calView = new (require("/ui/AutoHeightView"))(strData);
		row.add(calView);
	}

	rows.push(row);

	var row1 = Ti.UI.createTableViewRow({
		header : "농사 속담"
	});
	var proverbView = new (require("/ui/AutoHeightView"))(e.data.proverb);
	row1.add(proverbView);
	rows.push(row1);

	var row2 = Ti.UI.createTableViewRow({
		header : "이달의 농사일"
	});
	var workView = new (require("/ui/AutoHeightView"))(e.data.work);
	row2.add(workView);
	rows.push(row2);

	var row3 = Ti.UI.createTableViewRow({
		header : "제철 먹을꺼리"
	});
	var foodView = new (require("/ui/AutoHeightView"))(e.data.food);
	row3.add(foodView);
	rows.push(row3);
	
	
	var row4 = Ti.UI.createTableViewRow({
		header : "DB 업데이트",
		title : '클릭하면 업데이트 합니다.'
	});
	row4.addEventListener("click", function(){
		
		var indicator = Ti.UI.createActivityIndicator({
			color: "green",
			message: "DB를 업데이트 중입니다...",
			top : Ti.Platform.displayCaps.platformHeight / 2,
			left: Ti.Platform.displayCaps.platformWidth / 2
		});
		win.add(indicator);
		
		indicator.show();
		getRemoteFile("dongu"+ new Date().getTime() +".db", "http://miconblog.com/sqlite/dongu.sqlite", 
		function(end){
			console.log("완료: ", end);
			indicator.hide();
			win.remove(indicator);
			indicator = null;
			
			if(end.error){
				alert(end.error);
			}else{
				Ti.App.fireEvent("UPDATE_DATA_BASE", end);
			}
		}, 
		function(progress){
			console.log("진행중: ", progress);
		})
	});
	rows.push(row4);
	tableView.setData(rows);
});

// 한번만 발생한다.
win.addEventListener("focus", function(e) {
	Ti.App.fireEvent("UPDATE_THIS_MONTH_INFO");
});

