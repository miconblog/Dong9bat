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
	console.log("이미지 패스: ", win.filePath);
	if (taNote.value.length < 1) {
		alert("일지를 작성하세요!");

	} else {
		Ti.App.fireEvent("ADD_GARDEN_HISTORY", {
			gardenId : win.gardenId,
			note : taNote.value,
			content : win.filePath
		});

		var imageDir = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'GardenDetail');
		if (! imageDir.exists()) {
			imageDir.createDirectory();
		}

		var imgFile = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory + win.filePath);
		imgFile.write(imgView.image);
		win.close();
	}
});
win.rightNavButton = save;

// 입력폼
var tableView = Titanium.UI.createTableView({
	width : 320,
	top : 0,
	style : Titanium.UI.iPhone.TableViewStyle.GROUPED,
	allowsSelection: false
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
	var dialog = Titanium.UI.createOptionDialog({
		options : ['사진 찍기', '사진 선택', '취소'],
		cancel : 2,
		title : '사진을 추가할까요?!'
	});
	dialog.addEventListener("click", function(e) {
		switch(e.index) {
			case 0:
				// 카메라
				openCamera();
				break;

			case 1:
				// 앨범
				openPhotoAlbum();
				break;
		}

	});
	dialog.show();

});
var rows = [];

// ## 메모
var row = Ti.UI.createTableViewRow({
	height : Ti.UI.SIZE,
	layout : "horizontal"
});
var imgView = Ti.UI.createImageView({
	width : 100,
	height : 100,
	image : "/images/camera2.png",
	left : 10
});
var taNote = Ti.UI.createTextArea({
	color : '#222',
	font : {
		fontFamily : "NanumGothic",
		fontSize : 14
	},
	enableReturnKey : false,
	keyboardType : Ti.UI.KEYBOARD_DEFAULT,
	returnKeyType : Ti.UI.RETURNKEY_NEXT,
	keyboardToolbar : [flexSpace, camera, flexSpace],
	keyboardToolbarColor : '#999',
	keyboardToolbarHeight : 40,
	suppressReturn : false,
	textAlign : 'left',
	top : 10,
	left : 5,
	bottom : 10,
	width : 180,
	height : 100
});

row.add(imgView);
row.add(taNote);
rows.push(row);

tableView.setData(rows);

var openCamera = function() {
	Titanium.Media.showCamera({
		success : function(event) {
			var image = event.media;
			imgView.image = image;
			win.filePath = "/GardenDetail/Contents_" + new Date().getTime() + ".jpg";
			taNote.focus();
		},
		cancel : function(){
			taNote.focus();
		},
		error : function(error) {
			// create alert
			var a = Titanium.UI.createAlertDialog({
				title : 'Camera'
			});

			// set message
			if (error.code == Titanium.Media.NO_CAMERA) {
				a.setMessage('Device does not have video recording capabilities');
			} else {
				a.setMessage('Unexpected error: ' + error.code);
			}

			// show alert
			a.show();
		},
		allowEditing : true
	});
}
var openPhotoAlbum = function() {
	Titanium.Media.openPhotoGallery({
		success : function(event) {
			var image = event.media;
			imgView.image = image;
			win.filePath = "/GardenDetail/Contents_" + new Date().getTime() + ".jpg";
			taNote.focus();
		},
		cancel : function(){
			taNote.focus();
		},
		allowEditing : true
	});
};

win.add(tableView);
win.addEventListener("open", function(e) {
	setTimeout(function() {
		taNote.focus();
	}, 500);
});
