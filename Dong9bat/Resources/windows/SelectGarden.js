var win = Titanium.UI.currentWindow;
var close = Ti.UI.createButton({
	title : "닫기",
	style : Ti.UI.iPhone.SystemButtonStyle.DONE
});
close.addEventListener("click", function(e) {
	win.close();
});
win.rightNavButton = close;

var search = Ti.UI.createSearchBar({
	hintText : '검색할 텃밭 이름을 입력하세요.'
});
search.addEventListener('return', function(e) {
	search.blur();
});
search.addEventListener('cancel', function(e) {
	search.blur();
});

var rows = [];
var tableView = Ti.UI.createTableView({
	search : search,
	filterAttribute : 'title',
	separatorColor : '#999'
});

console.log("텃밭 목록: ---- ", win.data)

for (var i = 0; i < win.data.length; ++i) {
	var row = Ti.UI.createTableViewRow({
		title : win.data[i].name,
		gardenId: win.data[i].gardenId
	});
	rows.push(row);
}
tableView.setData(rows);
tableView.addEventListener("click", function(e){
	Ti.App.fireEvent("SELECT_GARDEN_FOR_TODOS", {
		name : e.rowData.title,
		gardenId: e.rowData.gardenId
	});
	win.close();
});

win.add(tableView);
