Ti.include("/util/util.js");
setContentView = function(tv, data, isReload) {
	var rows = tv.getData();

	for (var i = 0; i < data.length; i++) {
		var row = Ti.UI.createTableViewRow({
			height : Ti.UI.SIZE,
			className : 'garden-row',
			clickName : 'row',
			backgroundImage : '/images/garden/detail/tb_bg.png',
			rowId : data[i].no,
			layout : 'horizontal'
		});

		// 왼쪽 이미지 아이콘 뷰
		var leftView = Ti.UI.createView({
			top : 20,
			left : 26,
			width : 30,
			height : Ti.UI.SIZE,
			layout : 'horizontal'
		});

		var typeIcon = Ti.UI.createImageView({
			image : '/images/garden/detail/type_' + data[i].contentType + '.png',
			width : 30,
			height : 30,
			anchorPoint : {
				x : 0.5,
				y : 0.5
			}
		});

		// 오른쪽 컨텐츠 뷰
		var rightView = Ti.UI.createView({
			layout : 'vertical',
			height : Ti.UI.SIZE
		});

		// 컨텐츠
		var contentView = Ti.UI.createView({
			height : Ti.UI.SIZE,
			layout : 'horizontal'
		});

		// 날짜
		var dateView = Ti.UI.createView({
			height : Ti.UI.SIZE,
			layout : 'horizontal'
		});

		// 컨텐츠 제목
		var title = Ti.UI.createLabel({
			color : '#8B4619',
			font : {
				fontSize : '13',
				fontWeight : 'bold',
				fontFamily : 'NanumGothic'
			},
			left : 7,
			top : 23,
			text : data[i].title,
			height : Ti.UI.SIZE
		});

		// 날짜
		var pubDate = Ti.UI.createLabel({
			color : '#78542f',
			font : {
				fontSize : '10.5',
				fontWeight : 'Regular',
				fontFamily : 'NanumGothic'
			},
			left : 7,
			bottom : 23,
			text : getLocalDate(data[i].pubDate),
			height : Ti.UI.SIZE
		});

		if (data[i].contentType == 2) {// 사용자 컨텐츠
			row.editable = true;
			var bgTop = Ti.UI.createView({
				backgroundImage : "/images/garden/detail/balloon_t.png",
				width : 512 / 2,
				height : 67 / 2,
				top : 6,
				layout : "horizontal"
			});

			var bgMiddle = Ti.UI.createView({
				top : -27.5,
				left : 7,
				backgroundImage : "/images/garden/detail/balloon_m.png",
				width : 498 / 2,
				height : Ti.UI.SIZE,
				layout : "vertical",
				zIndex : 1
			});

			var bgBotton = Ti.UI.createView({
				left : 7,
				backgroundImage : "/images/garden/detail/balloon_b.png",
				width : 498 / 2,
				height : 21 / 2,
				bottom : 23,
				layout : "horizontal"
			});

			var img = Ti.UI.createView({
				backgroundImage : data[i].content,
				zIndex : 5,
				left : 7,
				right : 7,
				width : Ti.UI.FILL,
				height : 200
			});

			title.top = 12;
			title.bottom = 9;
			pubDate.bottom = 9;

			if (data[i].content.length > 0) {
				bgMiddle.add(img);
			}
			bgMiddle.add(title);
			bgMiddle.add(pubDate);
			contentView.add(bgTop);
			contentView.add(bgMiddle);
			contentView.add(bgBotton);

			img.addEventListener("load", function(e) {
				console.log("LOAD");
				rightView.add(img);

			})
		} else {// 미션
			row.editable = false;
			contentView.add(title);
			dateView.add(pubDate);
		}

		if (data[i].contentType == 3 || data[i].contentType == 4) {
			row.hasChild = true;
			row.selectionStyle = true;
		} else {
			row.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
		}

		leftView.add(typeIcon);
		rightView.add(contentView);
		rightView.add(dateView);

		row.add(leftView);
		row.add(rightView);

		if (rows.length < 1) {
			tv.appendRow(row);
			tv.appendRow(Ti.UI.createTableViewRow({
				height : 80,
				className : 'dummy-row',
				backgroundImage : '/images/garden/detail/tb_bg.png',
				layout : 'horizontal'
			}));
		} else {
			tv.insertRowBefore(0, row);
		}
	}
	console.log("데이터 --> ", rows, rows.length);
	if (isReload && data.length >= 3) {
		tv.setHeight(Ti.UI.SIZE);
	}
}
