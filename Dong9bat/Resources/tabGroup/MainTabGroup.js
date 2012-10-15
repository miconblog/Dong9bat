/**
 * 탭그룹을 만든다. 
 */
function MainTabGrop() {
	var tabGroup = Ti.UI.createTabGroup();
	var AppWindow = require('/ui/AppWindow');
	
	// 작물 윈도우 열릴때 탭UI 생성
	var tabWindow = Ti.UI.createWindow({
		url : "/ui/TabWindow.js",
		height : 20 + 48,
		bottom : 0,
		width : 320,
		zIndex : 10
	});

	var tabData = [
		{title:"작물"},
		{title:"텃밭"},
		{title:"절기달력"},
		{title:"할일"},
		{title:"가이드"}
	];
	//var tabs = [];
	
	for(var i=0; i<tabData.length; i++){
		var win = AppWindow({
			title: tabData[i].title, 
			url: "/tabGroup/tab"+(i+1)+"/main.js",
			tabBarHidden: true
		}); 
		if(i==0){
			win.backgroundImage = '/images/content_bg.png';
		}else if(i==4){
			win.backgroundImage = '/images/content_bg.png';
		}else{
			win.backgroundImage = '/images/crops/detail/page_back.png';
		}
		var tab = Ti.UI.createTab({
			window: win,
			title: tabData[i].title
		});
		tabGroup.addTab(tab);
		//tabs.push(tab);
	}
	
	this.setActiveTab = function(nIndex){
		tabGroup.setActiveTab(nIndex);
	}
	
	this.open = function(){
		tabGroup.open();
		tabWindow.open();
	};
	
	this.setBadge = function(){
		alert(1);
	};
	return this;
};

module.exports = MainTabGrop;