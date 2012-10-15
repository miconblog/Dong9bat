exports.setBGView = function(win, view, scrollView) {
	var imgView = Ti.UI.createImageView({
		width : 320,
		height : 320,
		image : "",
		backgroundColor : "#345",
		top : -80,
		zIndex : 0
	});
	win.add(imgView);
	bAttachWin = true;

	var openCamera = function() {
		Titanium.Media.showCamera({
			success : function(event) {
				var cropRect = event.cropRect;
				var image = event.media;

				Titanium.Media.saveToPhotoGallery(image);

				Titanium.UI.createAlertDialog({
					title : 'Photo Gallery',
					message : 'Check your photo gallery'
				}).show();
			},
			cancel : function() {

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
	var f = Ti.App.Properties.getString("filename");
	var bgImage = null;
	if (f != null) {
		Ti.API.info(f);
		bgImage = Titanium.Filesystem.getFile(f);
		imgView.image = bgImage;

	}
	var openPhotoAlbum = function() {
		Titanium.Media.openPhotoGallery({
			success : function(event) {
				var image = event.media;
				imgView.image = image;

				// create new file name and remove old
				var filename = Titanium.Filesystem.applicationDataDirectory + "/" + new Date().getTime() + ".jpg";
				Ti.App.Properties.setString("filename", filename);
				if (bgImage != null) {
					bgImage.deleteFile();
				}
				bgImage = Titanium.Filesystem.getFile(filename);
				bgImage.write(image);

			},
			cancel : function() {

			},
			error : function(error) {
			},
			allowEditing : true
		});
	};

	var writeNote = function() {

	};

	scrollView.addEventListener("scroll", function(e) {

		if (e.y < 0) {
			Ti.API.info(e.y);
			imgView.animate({
				top : -80 - (e.y / 2),
				duration : 10
			});
			
			if(!bAttachWin){
				view.remove(imgView);
				win.add(imgView);
				bAttachWin = true;	
			}
			
		}else{
			if( bAttachWin ){
				bAttachWin = false;
				win.remove(imgView);
				view.add(imgView);
			}
		}

	});
	// 배경 사진을 클릭할수있는 영역
	var clickView = Ti.UI.createView({
		top : 0,
		height : 160,
		width : 320,
		zIndex : 1
		//borderWidth : 1,
		//borderColor : "yellow",
		//backgroundColor : "green"
	});
	clickView.addEventListener("click", function(e) {
		var dialog = Titanium.UI.createOptionDialog({
			options : ['사진 찍기', '사진 선택', '노트 쓰기', '취소'],
			destructive : 2,
			cancel : 3,
			title : '배경 사진을 바꾸거나 노트를 남기세요!'
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

				case 2:
					// 글쓰기
					writeNote();
					break;

			}

		});
		dialog.show();
	});
	view.add(clickView);
}
