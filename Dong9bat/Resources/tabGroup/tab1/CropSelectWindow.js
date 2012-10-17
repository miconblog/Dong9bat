var win = Ti.UI.currentWindow;

var back = Ti.UI.createButton({
	width : 51,
	height : 30,
	backgroundImage : '/images/button_back.png',
	backgroundSelectedImage : '/images/button_back_selected.png'
});

back.addEventListener('click', function() {
	Ti.App.fireEvent("SHOW_MAIN_TAB_MENU");
	win.close();
});
win.leftNavButton = back;

var scrollView = Ti.UI.createScrollView({
	contentWidth : 'auto',
	contentHeight : 'auto',
	showVerticalScrollIndicator : true
});

// 상단 뷰
var BasicView = Ti.UI.createView({
	width : 163,
	height : 59,
	top : 10,
	left : 136,
	backgroundImage : '/images/crops/detail/bg_basic_info.png'
});
scrollView.add(BasicView);

var seperator1 = Ti.UI.createView({
	width : 320,
	height : 2,
	backgroundImage : '/images/crops/detail/seperator.png',
	top : 140,
	left : 0
});
scrollView.add(seperator1);

// 생육 단계 & 토마토 이야기
var graphView = Ti.UI.createView({
	width : 320,
	height : 348,
	left : 0,
	top : 150
});
var lbGraphTitle = require('ui/TitleLabel')('생육 단계');
graphView.add(lbGraphTitle);
var graphImage = Ti.UI.createImageView({
	image : '/images/crops/detail/crop_graph.png',
	width : 241,
	height : 485 / 2,
	left : (320 - 241) / 2,
	top : 30
});
graphView.add(graphImage);

var arrowImage = Ti.UI.createImageView({
	image : '/images/crops/detail/step_arrow.png',
	anchorPoint : {
		x : 0.5,
		y : 1
	},
	width : 10,
	height : 64,
	left : 155,
	top : 90
});

// 현재 날짜로 화살표 위치 결정
var now = new Date();
var fst = new Date(now.getFullYear() + "/1/1");
var days = Math.floor((now.getTime() - fst.getTime()) / 1000 / 60 / 60 / 24);
var m = Ti.UI.create2DMatrix();
m = m.rotate(days * 360 / 365);
arrowImage.animate({
	transform : m,
	duration : 500
});
graphView.add(arrowImage);

scrollView.add(graphView);

var stepGuideView = Ti.UI.createView({
	backgroundImage : "/images/crops/detail/step_guide.png",
	width : 640 / 2,
	height : 67 / 2,
	top : 460
});
scrollView.add(stepGuideView);

var seperator2 = Ti.UI.createView({
	width : 320,
	height : 2,
	backgroundImage : '/images/crops/detail/seperator.png',
	top : 510,
	left : 0
});
scrollView.add(seperator2);

var tableView = Ti.UI.createTableView({
	top : 520,
	//	height: Ti.UI.FILL,
	allowsSelection : false,
	scrollable : false,
	style : Ti.UI.iPhone.TableViewStyle.GROUPED
});
scrollView.add(tableView);
win.add(scrollView);

Ti.App.addEventListener("DRAW_CROP_DETAIL", function(e) {
	var cropInfo = e.data;
	var data = [];

	console.log("작물 데이터: ", cropInfo.img);

	// 작물 이미지
	var cropImageView = Ti.UI.createImageView({
		image : cropInfo.img,
		width : 116,
		height : 116,
		top : 10,
		left : 10
	});
	scrollView.add(cropImageView);

	// 재배 난이도
	var difficulty = new (require('/ui/RankStar'))(cropInfo.difficulty, {
		left : 206,
		top : 10
	});
	scrollView.add(difficulty);

	// 재배기간
	var period = Ti.UI.createLabel({
		text : cropInfo.period,
		color : '#5fae7b',
		top : 26,
		left : 200,
		width : 50,
		height : 25,
		font : {
			fontSize : 13,
			fontFamily : "NanumGothic",
			fontWeight : "bold"
		}
	});
	scrollView.add(period);

	// 요즘 단계
	var backColor = ['#8cc63f', '#397708', '#50a2c4', '#bc7643', '#d85632', '#d3bca5'];
	var seedGuide = Ti.UI.createLabel({
		text : cropInfo.stepName,
		color : backColor[cropInfo.step],
		top : 47,
		left : 180,
		height : 25,
		font : {
			fontSize : 13,
			fontFamily : "NanumGothic",
			fontWeight : "bold"
		},
		textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
	});
	scrollView.add(seedGuide);


	// 심기 버튼 
	var plantButton = Ti.UI.createButton({
		top : 84,
		left : 136,
		width : 169,
		height : 42,
		backgroundImage : '/images/crops/detail/button_plant.png',
		backgroundSelectedImage : '/images/crops/detail/button_plant_selected.png'
	});
	plantButton.addEventListener("click", function(e) {		
		var imageView = Ti.UI.createImageView({
			image : cropInfo.img,
			top : 20,
			left : 120
		});
		win.add(imageView);

		var matrix = Ti.UI.create2DMatrix();
		matrix = matrix.scale(0.4, 0.4);
		var matrix2 = Ti.UI.create2DMatrix();
		matrix2 = matrix.scale(0.4, 0.4);
		imageView.animate({
			top : -80,
			left : -10,
			transform : matrix,
			duration : 500
		}, function(e) {
			imageView.animate({
				top : 480,
				left : 0,
				transform : matrix2,
				duration : 400
			}, function(e) {
				Ti.App.fireEvent("ADD_CROP_TO_GARDEN", {
					cropId : cropInfo.cropId,
					name   : cropInfo.name,
					period : cropInfo.period,
					day    : 1						// 심은 첫날!
				});
				imageView.hide();
				win.remove(imageView);
				plantButton.enabled = false;
				plantButton.setColor("#CCC");
				
				Ti.App.fireEvent("SHOW_MAIN_TAB_MENU");
				win.close();
			});
		});
	});
	scrollView.add(plantButton);

	// 테이블 데이터 설정
	var headers = ["작물 소개", "기르기", "씨받기", "건강", "백과사전"];
	var keys = ["intro", "howto", "seed", "health", "wiki"];
	var rows = [];
	for (var i = 0; i < headers.length; ++i) {
		var view = new (require("/ui/AutoHeightView"))(cropInfo[keys[i]]);
		var row = Ti.UI.createTableViewRow({
			header : headers[i]
		});

		row.add(view);
		rows.push(row);
	}
	
	// 짤림 방지를 위한 더미 ROW 
	rows.push(Ti.UI.createTableViewRow({header:"", height:80}));
	tableView.setData(rows);
});

win.addEventListener("open", function(e) {
	Ti.App.fireEvent("LOAD_CROP_INFO", {
		cropId : win.data.cropId
	});
	

});

Ti.App.addEventListener("CLOSE_CROP_SELECT_WINDOW", function(e) {
	win.close();
});
