var win = Ti.UI.currentWindow;
win.barImage = "/images/title_bg.png";
var close = Ti.UI.createButton({
	title : '취소'
});
close.addEventListener('click', function(e) {
	win.close();
});
win.leftNavButton = close;

var save = Ti.UI.createButton({
	title : '완료',
	enabled : false
});

// 입력폼
var tableView = Titanium.UI.createTableView({
	width : 320,
	//	separatorStyle:Ti.UI.iPhone.TableViewSeparatorStyle.NONE,
	top : 0,
	style : Titanium.UI.iPhone.TableViewStyle.GROUPED
});

var rows = [];
var row1 = Ti.UI.createTableViewRow({
	header : "일할 텃밭",
	height : 40,
	hasChild : true
});

var lbType = Ti.UI.createLabel({
	color : '#900',
	width : 280,
	height : 30,
	left : 10,
	top : 5,
	value : 0,
	text : "지정하지 않음",
	textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
	font : {
		fontFamily : 'NanumGothic',
		fontSize : 15
	}
});
row1.add(lbType);
rows.push(row1)


var row2 = Ti.UI.createTableViewRow({
	header : "메모",
	height : 100
});

var taMemo = Ti.UI.createTextArea({
	color : '#222',
	font : {
		fontFamily : "NanumGothic",
		fontSize : 14
	},
	keyboardType : Ti.UI.KEYBOARD_DEFAULT,
	returnKeyType : Ti.UI.RETURNKEY_DONE,
	textAlign : 'left',
	top : 10,
	left : 10,
	width : 280,
	height : 80
});
row2.add(taMemo);
rows.push(row2);


var row3 = Ti.UI.createTableViewRow({
	header : "알림",
	height : 40,
	hasChild : true
});


var row3 = Ti.UI.createTableViewRow({
	header : "알림",
	height : 40
});

var lbAlram = Ti.UI.createLabel({
	text : '알림 설정',
	height : 30,
	top : 5,
	left : 10,
	width : 280,
	font : {
		fontFamily : 'NanumGothic',
		fontSize : 14
	}
});
row3.add(lbAlram);

var alramSwitch = Ti.UI.createSwitch({
	value : false, // mandatory property for iOS
	enabled : true,
	right : 10
});
alramSwitch.addEventListener('change', function(e) {
	if (alramSwitch.value) {
		tableView.appendRow(row4);
	} else {
		tableView.deleteRow(3);
	}
});
row3.add(alramSwitch);
rows.push(row3);


var row4 = Ti.UI.createTableViewRow({
	height : 40,
	hasChild : true
});
var lbDate = Ti.UI.createLabel({
	text : '날짜를 선택하세요.',
	height : 30,
	top : 5,
	left : 10,
	width : 280,
	font : {
		fontFamily : 'NanumGothic',
		fontSize : 14
	}
});
var datePicker = new (require('/ui/DatePicker'))(lbDate);
row4.addEventListener("click", function(e) {
	datePicker.show();
	row2.hasCheck = true;
	checkComplete();
});
row4.add(lbDate)
//rows.push(row4);


tableView.setData(rows);
win.add(tableView);
