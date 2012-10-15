var SYS_DATABASE_NAME = 'DONGUBUT';
var USER_DATABASE_NAME = 'DONGUBUT_USER';

exports.createDb = function() {
	Ti.Database.install('dongu.db', SYS_DATABASE_NAME);
	Ti.Database.install('dongu_user.db', USER_DATABASE_NAME);
};

exports.updateDb = function(e) {
	console.log("데이터베이스 업그레이드");
	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory);
	var privateDir = file.nativePath.replace("Documents/", "Library/Private%20Documents/");
	var dbfile = Ti.Filesystem.getFile(privateDir, SYS_DATABASE_NAME + ".sql");

	if (dbfile.exists()) {
		console.log("기존 DB 지운다!");
		dbfile.deleteFile();
	}
	Ti.Database.install(e.path + e.file, SYS_DATABASE_NAME);

	var temp = Ti.Filesystem.getFile(e.path + e.file);
	if (temp.exists()) {
		console.log("임시 파일 삭제: ", temp.nativePath);
		temp.deleteFile();
	}

};

/**
 * 모든 작물 정보를 반환한다. 작물 페이지에 노출될 정보
 */
exports.getAllCrops = function() {
	var db = Ti.Database.open(SYS_DATABASE_NAME);
	var rows = db.execute('SELECT * FROM tb_crops ORDER BY ordering ASC');
	var data = [];
	while (rows.isValidRow()) {
		data.push({
			cropId : rows.fieldByName('cropId'),
			name : rows.fieldByName('name'),
			icon : rows.fieldByName('icon')
		});
		rows.next();
	}
	db.close();
	return data;
};

/**
 * 작물 상세 정보를 반환한다. 작물 상세 페이지에 노출될 정보
 */
exports.getCropInfo = function(_cropId) {
	var db = Ti.Database.open(SYS_DATABASE_NAME);
	var row = db.execute('SELECT * FROM tb_crops WHERE cropId=' + _cropId);
	var data = {};
	if (row.isValidRow()) {
		data = {
			cropId : row.fieldByName('cropId'),
			name : row.fieldByName('name'),
			icon : row.fieldByName('icon'),
			img : row.fieldByName('img'),
			period : row.fieldByName('period'),
			difficulty : row.fieldByName('difficulty'),
			intro : row.fieldByName('intro'),
			howto : row.fieldByName('howto'),
			seed : row.fieldByName('seed'),
			health : row.fieldByName('health'),
			wiki : row.fieldByName('wiki')
		}
	}
	db.close();
	return data;
};

exports.getThisMonthInfo = function() {
	console.log('getThisMonthInfo: ', SYS_DATABASE_NAME);
	var db = Ti.Database.open(SYS_DATABASE_NAME);
	var dt = new Date();
	var month = dt.getMonth() + 1;

	var data = {};
	var row = db.execute('SELECT proverb, work, food FROM tb_12cal WHERE month = ?', month);
	if (row.isValidRow()) {
		data = {
			month : month,
			proverb : row.fieldByName('proverb'),
			work : row.fieldByName('work'),
			food : row.fieldByName('food'),
		}
	}
	db.close();
	return data;
};

/**
 * 현재 날짜와 비교해 24절기 달력 정보를 가져온다.
 * @return {Object} 절기 정보
 */
exports.get24CalendarInfo = function() {
	var db = Ti.Database.open(SYS_DATABASE_NAME);
	var dt = new Date();
	var dateStr = (dt.getMonth() + 1 ) + "." + dt.getDate();

	var data = {};
	var row = db.execute('SELECT name, content, date FROM tb_24cal WHERE date = ?', dateStr);
	if (row.isValidRow()) {
		data = {
			name : row.fieldByName('name'),
			content : row.fieldByName('content'),
			date : row.fieldByName('date')
		}
	}
	db.close();
	return data;
};

/**
 * 현재 날짜와 비교해 24절기 달력 정보를 가져온다.
 * @return {Array} 해당 달에 해당하는 절기 정보
 */
exports.get24CalendarInfoByMonth = function() {
	var db = Ti.Database.open(SYS_DATABASE_NAME);
	var dt = new Date();
	var dateStr = (dt.getMonth() + 1 ) + ".";
	var data = [];
	var rows = db.execute("SELECT name, content, date FROM tb_24cal WHERE date LIKE '%" + dateStr + "%'");
	while (rows.isValidRow()) {
		data.push({
			name 	: rows.fieldByName('name'),
			content : rows.fieldByName('content'),
			date 	: rows.fieldByName('date')
		});
		rows.next();
	}
	db.close();
	return data;
};

/**
 * 텃밭목록에 텃밭을 추가한다.
 * @param {Number} _cropId 작물아이디
 * @param {String} _name   텃밭이름
 * @param {Number} _period 재배기간
 */
exports.addGarden = function(_gardenId, _cropId, _name, _period) {
	var userdb = Ti.Database.open(USER_DATABASE_NAME);
	var row = userdb.execute('SELECT count(gardenId) FROM user_tb_gardens');
	var totalCount = row.field(0);
	var startDate = new Date().getTime();
	var endDate = startDate + (_period * 24 * 60 * 60 * 1000);
	
	userdb.execute('INSERT INTO user_tb_gardens(gardenId, cropId, name, startDate, endDate) VALUES (?,?,?,?,?)', _gardenId, _cropId, _name + " 텃밭 " + ++totalCount, startDate, endDate);

	for (var i = totalCount - 1; i > -1; --i) {
		userdb.execute('UPDATE user_tb_gardens SET ordering=' + (i + 1) + ' WHERE ordering =' + i);
	}

	// var retData = [];
	// var rows = userdb.execute('SELECT * FROM user_tb_gardens');
	// while (rows.isValidRow()) {
	// retData.push({gardenId:rows.fieldByName('gardenId'), sequence:rows.fieldByName('sequence')});
	// rows.next();
	// }
	// Ti.API.info(retData);
	//
	userdb.close();
};

exports.addMissionToTodos = function(gardenId, data){
	console.log("사용자 할일에 추가: ", gardenId, data);
	
	var userdb = Ti.Database.open(USER_DATABASE_NAME);
	userdb.execute('INSERT INTO user_tb_todos(gardenId, title, content, expire, startDate) VALUES (?,?,?,?,?)', 
	gardenId, data.title, data.content, data.expire, new Date().getTime());

	userdb.close();	
};


exports.getAllGardens = function() {
	var userdb = Ti.Database.open(USER_DATABASE_NAME);
	var retData = [];
	var rows = userdb.execute('SELECT * FROM user_tb_gardens ORDER BY ordering ASC');
	while (rows.isValidRow()) {
		retData.push({
			gardenId 	: rows.fieldByName('gardenId'),
			cropId 		: rows.fieldByName('cropId'),
			name 		: rows.fieldByName('name'),
			ordering 	: rows.fieldByName('ordering'),
			startDate 	: rows.fieldByName('startDate') - 0,
			endDate 	: rows.fieldByName('endDate') - 0
		});
		rows.next();
	}
	userdb.close();
	//Ti.API.info(retData);
	return retData;
};

var getCurrentPlantPeriodString = function() {
	var dt = new Date();
	var str = "%" + dt.getMonth();
	var day = dt.getDate();

	if (day < 11) {
		str += "a";
	} else if (day < 21) {
		str += "b";
	} else {
		str += "c";
	}
	return str + "%";
}
/**
 * 오늘 날짜에 해당하는 식물 기간 단계를 반환한다.
 * @param {Number} _cropId
 * @return {Number} 발육 단계
 */
exports.getPlantPeriodStep = function(_cropId) {
	var cpps = getCurrentPlantPeriodString();
	var db = Ti.Database.open(SYS_DATABASE_NAME);
	var row = db.execute('SELECT step FROM tb_plant_period WHERE cropId=' + _cropId + ' AND period LIKE "' + cpps + '"');
	if (row.isValidRow()) {
		var step = row.field(0);
		db.close();
		return step - 1;
	}
};

/**
 * 진행일에 해당하는 작물의 할일 반환
 * @param {Object} _cropId
 * @param {Object} _day
 */
exports.getCropMissionByDay = function(_cropId, _day) {
	var db = Ti.Database.open(SYS_DATABASE_NAME);
	var row = db.execute('SELECT missionId FROM tb_mission_by_crop WHERE cropId='+_cropId+' AND day='+ _day);
	console.log("검색중...", _cropId, _day, row);
	var missionIds = [];
	var missions = [];
	
	while (row.isValidRow()) {
		missionIds.push(row.field(0));
		row.next();
	}
	
	for(var i=0; i<missionIds.length ; ++i){
		row = db.execute('SELECT * FROM tb_missions WHERE missionId=' + missionIds[i]);
		
		if(row.isValidRow()){
			missions.push({
				missionId : row.fieldByName('missionId'),
				title 	  : row.fieldByName('title'),
				content   : row.fieldByName('content'),
				expire 	  : row.fieldByName('expire')	// 유효기간
			});
		}
	}
	
	db.close();
	return missions;
};

/**
 * 할일을 모두 가져온다.
 */
exports.getAllTodos = function(){
	var userdb = Ti.Database.open(USER_DATABASE_NAME);
	var row = userdb.execute('SELECT * FROM user_tb_todos ORDER BY important ASC');
	var data = [];
	
	while (row.isValidRow()) {
		data.push({
			todoId 		: row.fieldByName('no'),
			gardenId	: row.fieldByName('gardenId'),
			title   	: row.fieldByName('title'),
			content 	: row.fieldByName('content'),
			expire 		: row.fieldByName('expire'),
			complete	: row.fieldByName('complete'),
			important   : row.fieldByName('important'),
			startDate   : row.fieldByName('startDate')
		});
		row.next();
	}
	userdb.close();
	return data;
};

exports.updateGardenOrdering = function(_gardenId, _from, _to) {
	var userdb = Ti.Database.open(USER_DATABASE_NAME);
	userdb.execute('UPDATE user_tb_gardens SET ordering=' + _from + ' WHERE ordering=' + _to);
	userdb.execute('UPDATE user_tb_gardens SET ordering=' + _to + ' WHERE gardenId=' + _gardenId);
	userdb.close();
}

exports.deleteGarden = function(_gardenId) {
	var userdb = Ti.Database.open(USER_DATABASE_NAME);
	userdb.execute('DELETE FROM user_tb_gardens WHERE gardenId=' + _gardenId);
	userdb.close();
}

exports.updeateGardenName = function(_gardenId, _name) {
	var userdb = Ti.Database.open(USER_DATABASE_NAME);
	userdb.execute('UPDATE user_tb_gardens SET name="' + _name + '" WHERE gardenId=' + _gardenId);
	userdb.close();
}
