var win = Titanium.UI.currentWindow;

var search = Ti.UI.createSearchBar({
	backgroundImage: "/images/garden/search_back.png",
	hintText : '검색할 텃밭 이름을 입력하세요.'
});
search.addEventListener('return', function(e) {
	search.blur();
});
search.addEventListener('cancel', function(e) {
	search.blur();
});

var tableView = Ti.UI.createTableView({
	backgroundColor : "transparent",
	backgroundImage : '/images/crops/detail/page_back.png',
	editable : true,
	moveable : true,
	search : search,
	filterAttribute : 'filter',
	separatorColor : '#999',
	height: 368,
	top:0,
	width: 320
});

var AppWindow = require('ui/AppWindow');
var Util = require('util');
tableView.addEventListener('click', function(e) {
	win.hideTabBar();
	Ti.App.fireEvent("HIDE_MAIN_TAB_MENU");
	
	var data = e.rowData.data;
	data.title = e.rowData.name;

	
	var detailWin = AppWindow({
		url : "./GardenDetailWindow.js"
	}, data);
	Ti.UI.currentTab.open(detailWin);
});

tableView.addEventListener('move', function(e) {
	//Ti.API.info("move - row= " + e.row + ", index=" + e.index + ", section= "+ e.section + ", from = " + e.fromIndex);
	//Ti.API.info(e.rowData.data);
	Ti.App.fireEvent('UPDATE_GARDEN_ORDERING', {
		gardenId : e.rowData.data.gardenId,
		from : e.fromIndex + 1,
		to : e.index + 1
	})
});

tableView.addEventListener('delete', function(e) {
	//Ti.API.info("move - row= " + e.row + ", index=" + e.index + ", section= "+ e.section + ", from = " + e.fromIndex);
	//Ti.API.info(e.rowData.data);
	Ti.App.fireEvent('DELETE_GARDEN', {
		gardenId : e.rowData.data.gardenId
	})
});

// Add to the parent view.
win.add(tableView);

var edit = Ti.UI.createButton({
	title : "편집",
	width : 60,
	height: 30,
	font : {
		fontSize : '12',
		fontWeight : 'Bold',
		fontFamily : 'NanumGothic'
	},
	backgroundImage: '/images/button_edit.png',
	backgroundSelectedImage: '/images/button_edit_selected.png'
});
edit.addEventListener('click', function(e) {
	win.setRightNavButton(done);
	tableView.editing = true;
});

var done = Ti.UI.createButton({
	title : "완료",
	width : 60,
	height: 30,
	font : {
		fontSize : '12',
		fontWeight : 'Bold',
		fontFamily : 'NanumGothic'
	},
	backgroundImage: '/images/button_edit.png',
	backgroundSelectedImage: '/images/button_edit_selected.png'
});
done.addEventListener('click', function(e) {
	win.setRightNavButton(edit);
	tableView.editing = false;
});
win.setRightNavButton(edit);

var MissionPrograss = require('/ui/MissionProgress');

/**
 * 텃밭 목록을 업데이트 한다.
 {
 	cropId : 1,
 	cropInfo : {
 		difficulty : 5,
 		icon : "/images/crops/tomato.png",
 		img : "/images/sample/crop_tomato.jpg",
 		name : "\Ud1a0\Ub9c8\Ud1a0",
 		ordering : 1,
 		period : 5
 	},
 	gardenId : 1,
 	name : "\Ud1a0\Ub9c8\Ud1a0 \Ud143\Ubc2d 1",
 	startDate: "316596646",
 	ordering : 1
 }
 */
Ti.App.addEventListener("DRAW_GARDEN_LIST", function(e) {
	var data = e.data;
	var rowData = [];

	// create the rest of the rows
	for (var i = 0; i < data.length; i++) {
		var row = Ti.UI.createTableViewRow({
			height : 90,
			className : 'data-row',
			clickName : 'row',
			data : data[i],
			borderWidth :2,
			borderColor: "#D3C1B2"
		});
		//row.selectedBackgroundColor = '#fff';

		var photo = Ti.UI.createView({
			backgroundImage : '/images/garden/crop_back.png',
			top : 11,
			left : 10,
			width : 68,
			height : 68,
			zIndex : 1,
			clickName : 'photo'
		});
		row.add(photo);
		
		var title = Ti.UI.createLabel({
			color : '#8B4619',
			font : {
				fontSize : '13',
				fontWeight : 'bold',
				fontFamily : 'NanumGothic'
			},
			left : 88,
			top : 15,
			textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
			height : 'auto',
			width : 200,
			clickName : 'title',
			text : data[i].name
		});

		row.filter = title.text;
		row.add(title);
		row.name = title.text;
		row.prog = new MissionPrograss(row, {
			top : 45,
			left : 88,
			width : 160,
			startDate : data[i].startDate,
			endDate : data[i].endDate
		});;

		var strStartDate = Util.convertDate(data[i].startDate);
		var strEndDate = Util.convertDate(data[i].endDate);
		var date = Ti.UI.createLabel({
			color : '#78542F',
			font : {
				fontSize : 11,
				fontWeight : 'Regular',
				fontFamily : 'NanumGothic'
			},
			left : 88,
			bottom : 5,
			height : 20,
			width : 'auto',
			clickName : 'date',
			text : '시작일: ' +  strStartDate +'  수확일: ' + strEndDate
		});
		row.add(date);

		row.hasChild = true;
		rowData.push(row);
	}

	tableView.setData(rowData);

	Ti.API.info(['DRAW_GARDEN_LIST', e.data]);
});


/**
 * 밑으로 잡아 땡기면, 리스트 업데이트 한다.
 */

function formatDate()
{
	var date = new Date();
	var datestr = date.getFullYear()+"/"+date.getMonth()+'/'+date.getDate();
	if (date.getHours()>=12) {
		
		datestr+=' '+(date.getHours()==12 ? date.getHours() : date.getHours()-12)+':'+date.getMinutes()+' PM';
		
	} else {
		
		datestr+=' '+date.getHours()+':'+date.getMinutes()+' AM';
	
	}
	return datestr;
}
var border = Ti.UI.createView({
	backgroundColor:"#576c89",
	height:0,
	bottom:0
});

var tableHeader = Ti.UI.createView({
	backgroundColor:"#e2e7ed",
	width:320,
	height:60
});

// fake it til ya make it..  create a 2 pixel
// bottom border
tableHeader.add(border);

var arrow = Ti.UI.createView({
	backgroundImage:"/images/whiteArrow.png",
	width:23,
	height:60,
	bottom:10,
	left:20
});

var statusLabel = Ti.UI.createLabel({
	text:"업데이트하려면 아래로 당기세요.",
	left:55,
	width:200,
	bottom:30,
	height:"auto",
	color:"#576c89",
	textAlign:"center",
	font:{fontSize:13,fontWeight:"bold"},
	shadowColor:"#999",
	shadowOffset:{x:0,y:1}
});

var lastUpdatedLabel = Ti.UI.createLabel({
	text:"Last Updated: "+formatDate(),
	left:55,
	width:200,
	bottom:15,
	height:"auto",
	color:"#576c89",
	textAlign:"center",
	font:{fontSize:12},
	shadowColor:"#999",
	shadowOffset:{x:0,y:1}
});

var actInd = Titanium.UI.createActivityIndicator({
	left:20,
	bottom:13,
	width:30,
	height:30
});

tableHeader.add(arrow);
tableHeader.add(statusLabel);
tableHeader.add(lastUpdatedLabel);
tableHeader.add(actInd);

tableView.headerPullView = tableHeader;
var pulling = false;
var reloading = false;

function beginReloading()
{
	// just mock out the reload
	setTimeout(endReloading,2000);
}

function endReloading()
{
	
	// 진행상황 업데이트는 여기서...
	var rows = tableView.getData()[0].getRows();
	
	for(var i=0; i<rows.length; ++i){
		
		rows[i].prog.refresh();	
	}
	
	
	// when you're done, just reset
	tableView.setContentInsets({top:0},{animated:true});
	reloading = false;
	lastUpdatedLabel.text = "마지막 업데이트: "+formatDate();
	statusLabel.text = "업데이트하려면 아래로 당기세요.";
	actInd.hide();
	arrow.show();
}
tableView.addEventListener('scroll',function(e)
{
	if(reloading){return}
	var offset = e.contentOffset.y;
	if (offset <= -65.0 && !pulling)
	{
		var t = Ti.UI.create2DMatrix();
		t = t.rotate(-180);
		pulling = true;
		arrow.animate({transform:t,duration:180});
		statusLabel.text = "업데이트하려면 놓으세요.";
	}
	else if (pulling && offset > -65.0 && offset < 0)
	{
		pulling = false;
		var t = Ti.UI.create2DMatrix();
		arrow.animate({transform:t,duration:180});
		statusLabel.text = "업데이트하려면 아래로 당기세요.";
	}
});

tableView.addEventListener('scrollEnd',function(e)
{
	if (pulling && !reloading && e.contentOffset.y <= -65.0)
	{
		reloading = true;
		pulling = false;
		arrow.hide();
		actInd.show();
		statusLabel.text = "업데이트중 입니다..";
		tableView.setContentInsets({top:60},{animated:true});
		arrow.transform=Ti.UI.create2DMatrix();
		beginReloading();
	}
});


// 한번만 발생한다.
win.addEventListener("open", function(e) {
	Ti.App.fireEvent("UPDATE_GARDEN_LIST");
});

win.addEventListener("focus", function(e) {
	
	// 새로 업데이트 된 목록이 있으면 업데이트 한다.
	if (Ti.App.Properties.getBool("isUpdated")) {
		Ti.App.Properties.setBool("isUpdated", false);
		Ti.App.fireEvent("UPDATE_GARDEN_LIST");
	}
});