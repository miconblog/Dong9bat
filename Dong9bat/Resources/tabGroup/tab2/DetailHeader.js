exports.set = function(win) {
	var back = Ti.UI.createButton({
		width : 51,
		height : 30,
		backgroundImage : '/images/button_back.png',
		backgroundSelectedImage : '/images/button_back_selected.png',
	});
	back.addEventListener('click', function() {
		Ti.App.fireEvent("SHOW_MAIN_TAB_MENU");
		win.close();
	});
	win.leftNavButton = back;

	// var close = Ti.UI.createButton({
	// title : "텃밭",
	// style : Ti.UI.iPhone.SystemButtonStyle.BAR
	// });
	// close.addEventListener("click", function(e) {
	// Ti.App.fireEvent("SHOW_MAIN_TAB_MENU");
	// win.close();
	// });
	// win.leftNavButton = close;

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
	done.addEventListener("click", function(e) {
		win.rightNavButton = null;
		textField.blur();
		titleView.remove(textField);
		back.enabled = true;

		win.data.name = textField.value;
		label.setText(textField.value);

		Ti.App.fireEvent("UPDATE_GARDEN_NAME", {
			name : textField.value,
			gardenId : win.data.gardenId
		});

		Ti.App.Properties.setBool("isUpdated", true);
		Ti.App.fireEvent("UPDATE_GARDEN_LIST");
	});

	// Create a Label.
	var label = Ti.UI.createLabel({
		//width: 'auto',
		height : 40,
		top : 0,
		left : 0,
		text : win.data.title,
		color : '#FFF',
		font : {
			fontSize : 20,
			fontWeight : "bold"
		},
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : 200
	});
	// Create a TextField.
	var textField = Ti.UI.createTextField({
		height : 32,
		top : 4,
		left : 0,
		width : 200,
		value : win.data.title,
		keyboardType : Ti.UI.KEYBOARD_DEFAULT,
		returnKeyType : Ti.UI.RETURNKEY_DEFAULT,
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED
	});

	// Listen for return events.
	textField.addEventListener('return', function(e) {
		done.fireEvent("click");
	});
	label.addEventListener("click", function() {
		titleView.add(textField);
		win.rightNavButton = done;
		back.enabled = false;
		textField.focus();

	});

	var titleView = Ti.UI.createView({
		top : 0,
		width : '320',
		height : '40'
	});
	titleView.add(label);
	win.titleControl = titleView;
}
