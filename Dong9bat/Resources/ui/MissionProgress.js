/**
 * 미션과 프로그래스바를 동시에 표시한다.
 * @param {Object} opt
 */
function MissionProgress(row, opt) {

	var startDate = opt.startDate;
	var endDate = opt.endDate;
	var curDate = new Date().getTime();
	var value = 0;

	if (curDate > endDate) {
		value = opt.width - 2;
	} else {
		value = (opt.width - 2) * (curDate - startDate) / (endDate - startDate);
	}

	var view = Ti.UI.createView({
		backgroundColor : "#C3AB94",
		width : opt.width || 200,
		height : 10,
		top : opt.top || 0,
		left : opt.left || 0,
		clickname : 'progress'
	});

	// 기간은 날짜 --> DateTime으로 컨버팅
	// 5일 -> 5*24시간 -> 5*24*60분 -> 5*24*60*60초
	var bar = Ti.UI.createView({
		backgroundColor : "#60A071",
		width : value,
		height : 8,
		top : 1,
		left : 1,
		clickname : 'bar'
	});
	view.add(bar);

	row.add(view);

	var step = Math.floor(value*5 / 158) + 1;
	var plantPhase = Ti.UI.createView({
		backgroundImage : '/images/garden/plant_'+ step +'.png',
		top : 11,
		left : 10,
		width : 68,
		height : 68,
		zIndex : 2,
		clickName : 'phase'
	});
	row.step = step;
	row.add(plantPhase);

	this.refresh = function() {
		curDate = new Date().getTime();
		if (curDate > endDate) {
			value = opt.width - 2;
		} else {
			value = (opt.width - 2) * (curDate - startDate) / (endDate - startDate);
		}

		bar.width = value;
	}

	return this;
};
module.exports = MissionProgress;
