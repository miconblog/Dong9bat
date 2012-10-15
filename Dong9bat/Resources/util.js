exports.convertDate = function(time){
	var date = new Date(time);
	var year = date.getFullYear();
	var month = date.getMonth();
	var day = date.getDate();
	
	return year + "/" + month + "/" + day;
}
