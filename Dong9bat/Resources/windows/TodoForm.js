var win = Ti.UI.currentWindow;
win.barImage = "/images/title_bg.png";
var close = Ti.UI.createButton({
	title : "취소",
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
close.addEventListener('click', function(e) {
	win.close();
});
win.leftNavButton = close;

var save = Ti.UI.createButton({
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
save.addEventListener("click", function(e){
	if( !row2.hasCheck ){
		return alert("할일을 입력하세요 :) ");
	}
	
	Ti.App.fireEvent("ADD_USER_TODOS", {
		gardenId : lbGardenName.gardenId,
		title : taMemo.value,
		expire: lbDate.value
	})
	
	win.close();
	
});
win.rightNavButton = save;

// 입력폼
var tableView = Titanium.UI.createTableView({
	width : 320,
	//	separatorStyle:Ti.UI.iPhone.TableViewSeparatorStyle.NONE,
	top : 0,
	style : Titanium.UI.iPhone.TableViewStyle.GROUPED
});


// #일할 텃밭
var rows = [];
var row1 = Ti.UI.createTableViewRow({
	header : "일할 텃밭",
	height : 40,
	hasChild : true
});

// 일할 텃밭
var lbGardenName = Ti.UI.createLabel({
	color 	: '#900',
	width 	: 280,
	height 	: 30,
	left 	: 10,
	top 	: 5,
	gardenId: 0,
	text 	: "지정하지 않음",
	textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
	font : {
		fontFamily : 'NanumGothic',
		fontSize : 15
	}
});

lbGardenName.addEventListener("click", function(e){
	Ti.App.fireEvent("LOAD_GARDEN_LIST");
});
row1.add(lbGardenName);
rows.push(row1)


// ## 메모
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
taMemo.addEventListener("return", function(e){
	if( taMemo.value.length > 0 ){
		row2.hasCheck = true;
	}else{
		row2.hasCheck = false;
	}
	taMemo.blur();
});
row2.add(taMemo);
rows.push(row2);


// ## 알림
var row3 = Ti.UI.createTableViewRow({
	header : "데드라인",
	height : 40
});

var lbAlram = Ti.UI.createLabel({
	text : '날짜 지정',
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
	value : 0,
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
	checkComplete();
});
row4.add(lbDate)
tableView.setData(rows);
win.add(tableView);

Ti.App.addEventListener("DRAW_GARDEN_LIST_FOR_SELECT", function(e){
	var selectGarden = Ti.UI.createWindow({
		modal: true,
		title: "일할 텃밭을 고르세요.",
		url : "SelectGarden.js",
		data: e.data
	});
	selectGarden.open();
});

Ti.App.addEventListener("SELECT_GARDEN_FOR_TODOS", function(e){
	lbGardenName.text = e.name;
	lbGardenName.gardenId = e.gardenId;
});

