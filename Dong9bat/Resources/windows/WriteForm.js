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
save.addEventListener("click", function(e) {

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

var flexSpace = Ti.UI.createButton({
	systemButton : Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE
});
var camera = Ti.UI.createButton({
	backgroundImage : '/images/camera.png',
	height : 33,
	width : 33
});
camera.addEventListener('click', function() {
	Titanium.UI.createAlertDialog({
		title : 'Toolbar',
		message : 'You clicked camera!'
	}).show();
});
var rows = [];

// ## 메모
var row = Ti.UI.createTableViewRow();
var taNote = Ti.UI.createTextArea({
	color : '#222',
	font : {
		fontFamily : "NanumGothic",
		fontSize : 14
	},
	keyboardType : Ti.UI.KEYBOARD_DEFAULT,
	returnKeyType : Ti.UI.RETURNKEY_DONE,
	keyboardToolbar : [flexSpace, camera, flexSpace, flexSpace],
	keyboardToolbarColor : '#999',
	keyboardToolbarHeight : 40,
	textAlign : 'left',
	top : 10,
	left : 10,
	width : 280,
	height : 80
});
taNote.addEventListener("return", function(e) {
	if (taNote.value.length > 0) {
		row.hasCheck = true;
	} else {
		row.hasCheck = false;
	}
	taNote.blur();
});
row.add(taNote);
rows.push(row);

tableView.setData(rows);
win.add(tableView);

win.addEventListener("open", function(e) {
	taNote.focus();
});
