var UserContent = require("tabGroup/tab2/DetailUserContent");

exports.setTable = function(win, view) {
	// 테이블 뷰
	var tableView = Ti.UI.createTableView({
		top : 160,
		height : 'auto',
		scrollable : false,
		zIndex : 5
		//minRowHeight : 80,
		//backgroundImage: '/images/crops/detail/page_back.png'
	});

	// Populate the TableView data.
	var data = [{
		title : '텃밭 start',
		date : '2012-05-20',
		type : 'basic',
	}, {
		title : 'TODO 01 : 텃밭에 물을 주세요',
		date : '2012-05-20',
		type : 'mission_complete',
	}, {
		title : '오늘은 토마토를 땃다. 매우 먹음직스럽군~ 이히히히 배고프다. 엄마아빠. 빵ㅇ사주이ㅓ링ㄴㄹㅁㅇㅋㅋㅋ ',
		date : '2012-05-20',
		type : 'user_content',
	}, {
		title : 'TODO 02 : 텃밭에 거름을 주세요',
		date : '2012-05-20',
		type : 'mission'
	}];

	var rowData = [];
	// create the rest of the rows
	for (var i = data.length - 1; i > -1; i--) {
		var rowHt = 0;
		var row = Ti.UI.createTableViewRow({
			height : Ti.UI.SIZE,
			className : 'garden-row',
			clickName : 'row',
			backgroundImage : '/images/garden/detail/tb_bg.png',
			borderWidth : 1,
			borderColor : "#D3C1B2",
			layout : 'horizontal'
		});

		var leftView = Ti.UI.createView({
			left : 0,
			top : 0,
			width : 64,
			height : 80,
			borderWidth : 1,
			borderColor : "#F00",
		});
		row.add(leftView);

		var typeIcon = Ti.UI.createView({
			backgroundImage : '/images/garden/detail/type_' + data[i].type + '.png',
			width : 30,
			height : 30,
			top : 23.5,
			left : 25.5
		});
		leftView.add(typeIcon);

		// 오른쪽
		var rightView = Ti.UI.createView({
			left : 0,
			top : 0,
			borderWidth : 1,
			borderColor : "green",
			layout : 'vertical',
			height : Ti.UI.SIZE
		});
		row.add(rightView);

		if (data[i].type == "user_content") {// 사용자 컨텐츠
			
			var bgTop = Ti.UI.createView({
				backgroundImage: "/images/garden/detail/balloon_t.png",
				width: 512/2, 
				height: 67/2,
				zIndex: 1
			});
			rightView.add(bgTop);
			
			var bgMiddle = Ti.UI.createView({
				//top : 67/2,
				left: 7,
				backgroundImage: "/images/garden/detail/balloon_m.png",
				width: 498/2, 
				//height: 67/2,
				zIndex: 0
			});
			rightView.add(bgMiddle);
			
			
			var bgBotton = Ti.UI.createView({
				top : 67,
				left: 7,
				backgroundImage: "/images/garden/detail/balloon_b.png",
				width: 498/2, 
				height: 67/2,
				zIndex: 1
			});
			rightView.add(bgBotton);
			
			
			var img = Ti.UI.createView({
				backgroundImage: "/images/sample/crop_tomato.jpg",
				zIndex: 5,
				width: 250,
				height: 300,
				top: -300
			});
			rightView.add(img);
			
			img.addEventListener("load", function(e){
				console.log("LOAD");
				rightView.add(img);
				
			})
						
			rightView.height = 120;

		} else {
			// 타이틀 레이블
			var title = Ti.UI.createLabel({
				color : '#8B4619',
				font : {
					fontSize : '13',
					fontWeight : 'bold',
					fontFamily : 'NanumGothic'
				},
				left : 0,
				top : 25,
				textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
				text : data[i].title,
				height : Ti.UI.SIZE,
				borderWidth : 1,
				borderColor : "yellow"
			});
			rightView.add(title);

			// 날짜
			var pubDate = Ti.UI.createLabel({
				color : '#78542f',
				font : {
					fontSize : '10.5',
					fontWeight : 'Regular',
					fontFamily : 'NanumGothic'
				},
				left : 0,
				top : 9,
				//height : 30,
				textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
				text : data[i].date,
				borderWidth : 1,
				borderColor : "cyan"
				//height : Ti.UI.SIZE
			});
			rightView.add(pubDate);

		}
		

		if (data[i].type.indexOf("mission") > -1) {
			row.hasChild = true;
		}

		rowData.push(row);
	}

	tableView.setData(rowData);

	// Listen for click events.
	tableView.addEventListener('click', function(e) {
		//alert('title: \'' + e.row.title + '\', section: \'' + e.section.headerTitle + '\', index: ' + e.index);
	});

	view.add(tableView);
}
