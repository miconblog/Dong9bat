var STEP = 5;	// 랭크 갯수
var WIDTH = 184/2;
var HEIGHT = 34/2;

var RankStar = function(nRank, opt) {
	var thisView = Ti.UI.createView(opt);
	thisView.backgroundImage = '/images/ui/RankStar/rank_basic.png';
	thisView.width = WIDTH;
	thisView.height = HEIGHT;
	
	var maskImage = Ti.UI.createImageView({
		image: '/images/ui/RankStar/rank_mask.png',
		zIndex: 10,
		width: WIDTH,
		height: HEIGHT,
		top:0,
		left:0
	});
	
	var fillImage = Ti.UI.createView({
		backgroundImage: '/images/ui/RankStar/rank_fill.png',
		zIndex: 5,
		height: HEIGHT,
		width: WIDTH/STEP * nRank,
		top:0,
		left:0
	});
	
	thisView.add(maskImage);
	thisView.add(fillImage);
	
	return thisView;
}

module.exports = RankStar;
