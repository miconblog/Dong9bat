/**
 * 절기 달력 높이: 20
 * 탭그룹의 높이: 48
 */
var win = Ti.UI.currentWindow;
var tabHeaderView = Ti.UI.createView({
	backgroundColor : "transparent",
	width : 320,
	height : 20,
	top : 0
});
var tabHeader = Ti.UI.createImageView({
	width : 88,
	height : 20,
	top : 0,
	zIndex : 0,
	backgroundImage : "/images/tab_24cal_top.png",
	backgroundSelectedImage : "/images/tab_24cal_top_selected.png"
});
var dateText = Ti.UI.createLabel({
	width : 88,
	height : 20,
	top : 0,
	font : {
		fontSize : 11,
		font : "AppleGothic"
	},
	fontWeight : "bold",
	textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
	color : "#FFF",
	zIndex : 1
});

tabHeader.add(dateText);
tabHeaderView.add(tabHeader);

win.add(tabHeaderView);

var titles = ["작물", "텃밭", "24절기", "할일", "가이드"];
var images = ["tab_crop", "tab_garden", "tab_24cal", "tab_todo", "tab_guide"];
var count = titles.length;
var btns = [];
var currentSelectedIndex = 0;
for (var i = 0; i < count; i++) {
	var button = Ti.UI.createButton({
		width : 320 / count,
		height : 48,
		top : 20,
		left : i * (320 / count),
		index : i,
		backgroundImage : "/images/" + images[i] + ".png",
		backgroundSelectedImage : "/images/" + images[i] + "_selected.png"
	});
	button.addEventListener("click", function(e) {
		unselect(currentSelectedIndex);
		currentSelectedIndex = e.source.index;
		e.source.backgroundImage = e.source.backgroundSelectedImage;

		if (currentSelectedIndex == 2) {
			tabHeader.backgroundImage = tabHeader.backgroundSelectedImage;
		} else {
			tabHeader.backgroundImage = "/images/tab_24cal_top.png"
		}

		Ti.App.fireEvent("CLEAR_NEW_BADGE", {tabIndex: currentSelectedIndex});
		Ti.App.fireEvent("SELECT_TAB_BUTTON", {
			index : currentSelectedIndex
		});
	});

	var badgeView = Ti.UI.createImageView({
		image : '/images/badge.png',
		width : 18,
		height: 18,
		right : 2,
		top : 2,
		visible: false
	});
	var badge = Ti.UI.createLabel({
		width : 14,
		height: 14,
		top:2,
		left:2,
		text: "N",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		font: {
			fontFamily: "Helvetica",
			fontSize: 12
		},
		fontWeight: "bold",
		color: "#FFF"
	});
	badgeView.add(badge);
	button.add(badgeView);

	btns.push(button);
	win.add(button);
};

var unselect = function(index) {
	btns[index].backgroundImage = "/images/" + images[index] + ".png";
};
btns[0].backgroundImage = "/images/" + images[0] + "_selected.png";

/**
 * 달력 업데이트
 */
win.addEventListener("open", function() {
	Ti.App.fireEvent("TAB_WINDOW_OPENED");
});
Ti.App.addEventListener("UPDATE_CALENDAR", function(e) {
	var date = new Date();
	var dateStr = (date.getMonth()+1) + "월 " + date.getDate() + "일";
	dateText.setText(dateStr);

	if (e.text) {
		dateStr += " " + e.text;
		dateText.setText(dateStr);
	}

});

Ti.App.addEventListener("HIDE_MAIN_TAB_MENU", function(e) {
	win.animate({
		//left : -320,
		bottom : -50,
		duration : 350
	}, function() {
		//win.hide();
	})
});

Ti.App.addEventListener("SHOW_MAIN_TAB_MENU", function(e) {
	win.animate({
		//left : 0,
		bottom: 0,
		duration : 350
	}, function() {
		//win.show();
	})
});

Ti.App.addEventListener("DRAW_NEW_BADGE_ON_GARDEN", function(e) {
	var badgeView = btns[1].getChildren()[0];
	badgeView.show();
});

Ti.App.addEventListener("DRAW_NEW_BADGE_ON_TODOS", function(e) {
	var badgeView = btns[3].getChildren()[0];
	badgeView.show();
});

Ti.App.addEventListener("CLEAR_NEW_BADGE", function(e) {
	var badgeView = btns[e.tabIndex].getChildren()[0];
	badgeView.hide();
});
