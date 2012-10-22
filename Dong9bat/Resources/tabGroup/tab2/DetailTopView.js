var row = Ti.UI.createTableViewRow({
	width : 320,
	height : 160,
	zIndex : 0,
	editable : false
});

var imgView = Ti.UI.createImageView({
	width : 320,
	height : 320,
	image : win.data.bgImgPath,
	backgroundColor : "#345",
	top : 80,
	zIndex: 0
});

var wrapImg = Ti.UI.createView({
	width : 320,
	height : 320,
	top : -160
});
wrapImg.add(imgView);


tableView.addEventListener("scroll", function(e) {
	console.log("테이블뷰 스크롤: ", e.contentOffset.y, e.contentSize)
	if (e.contentOffset.y <= 0) {// 위로 올리면...
		imgView.animate({
			top : 80 + (e.contentOffset.y / 2),
			duration : 10
		});
	}
});

console.log("배경 이미지 경로는? ", win.data.bgImg);
var f = win.data.bgImg;
var bgImage = null;
if (f) {
	Ti.API.info(f);
	bgImage = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory + f);
	imgView.image = bgImage;
}

var openCamera = function() {
	Titanium.Media.showCamera({
		success : function(event) {
			var cropRect = event.cropRect;
			var image = event.media;
			imgView.image = image;

			// create new file name and remove old
			var filename = "Garden_" + win.data.gardenId + "_" + new Date().getTime() + ".jpg";

			Ti.App.fireEvent("SAVE_BG_IMAGE_FILE", {
				path : filename,
				gardenId : win.data.gardenId
			});

			//Ti.App.Properties.setString("filename", filename);
			if (bgImage != null) {
				bgImage.deleteFile();
			}
			bgImage = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory + filename);
			bgImage.write(image);
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

			// create new file name and remove old
			var filename = "Garden_" + win.data.gardenId + "_" + new Date().getTime() + ".jpg";

			Ti.App.fireEvent("SAVE_BG_IMAGE_FILE", {
				path : filename,
				gardenId : win.data.gardenId
			});

			//Ti.App.Properties.setString("filename", filename);
			if (bgImage != null) {
				bgImage.deleteFile();
			}
			bgImage = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory + filename);
			bgImage.write(image);

		},
		allowEditing : true
	});
};

// 배경 사진을 클릭할수있는 영역
var clickView = Ti.UI.createView({
	height : 160,
	width : 320
});

// 작물 배경 그림
var cropBackView = Ti.UI.createView({
	backgroundImage : '/images/garden/crop_back.png',
	bottom : 6,
	left : 8,
	width : 68,
	height : 68,
	zIndex : 1,
	clickName : 'cropBackView'
});

var cropView = Ti.UI.createView({
	backgroundImage : '/images/garden/plant_' + win.data.step + '.png',
	bottom : 6,
	left : 8,
	width : 68,
	height : 68,
	zIndex : 2,
	clickName : 'phase'
});

// 작물 이름
var cropName = Ti.UI.createLabel({
	color : '#FFF',
	font : {
		fontSize : '13',
		fontWeight : 'bold',
		fontFamily : 'NanumGothic'
	},
	left : 84,
	bottom : 6,
	textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
	height : Ti.UI.SIZE,
	width : Ti.UI.SIZE,
	clickName : 'cropName',
	text : win.data.cropInfo.name
});

// 새로 고침 버튼
var refreshBtn = Ti.UI.createButton({
	backgroundImage : '/images/garden/detail/refresh.png',
	backgroundSelectedImage : '/images/garden/detail/refresh_selected.png',
	anchorPoint : {
		x : 0.5,
		y : 0.5
	},
	bottom : 6,
	right : 40,
	width : 36,
	height : 36,
	clickName : "refresh"
});

// 글쓰기 버튼
var postBtn = Ti.UI.createButton({
	backgroundImage : '/images/garden/detail/post.png',
	backgroundSelectedImage : '/images/garden/detail/post_selected.png',
	bottom : 6,
	right : 8,
	width : 36,
	height : 36,
	clickName : "write"
});

// 이벤트
clickView.addEventListener("click", function(e) {

	console.log("배경 클릭: ", e.source.clickName);

	switch(e.source.clickName) {
		case "refresh":
			var m = Ti.UI.create2DMatrix();
			m = m.rotate(-180, 179);
			m2 = m.rotate(179);
			refreshBtn.animate({
				transform : m,
				duration : 1000
			}, function() {
				refreshBtn.animate({
					transform : m2,
					duration : 1000
				})
			});
			break;

		case "write":
			var writeForm = Ti.UI.createWindow({
				title : '텃밭 일지 등록',
				modal : true,
				backgroundColor : '#ccc',
				url : '/windows/WriteForm.js',
				gardenId : win.data.gardenId
			});
			writeForm.open();

			break;

		default:
			var dialog = Titanium.UI.createOptionDialog({
				options : ['사진 찍기', '사진 선택', '취소'],
				cancel : 2,
				title : '배경으로 쓸 텃밭 사진을 바꿀까요?!'
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
	}

});

row.add(wrapImg);
clickView.add(cropBackView);
clickView.add(cropView);
clickView.add(cropName);
clickView.add(refreshBtn);
clickView.add(postBtn);
row.add(clickView);
tableView.appendRow(row);
