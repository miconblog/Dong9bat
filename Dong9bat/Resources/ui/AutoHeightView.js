/**
 * 
 * @param {Object} sText
 * @param {Object} options
 */
function AutoHeightView(sText, options) {

	var opt = {
		backgroundColor : '#fff',
		borderRadius : 12,
		height : Ti.UI.SIZE,
		width : 300,
		top : 10,
		bottom : 10
	};

	for (var i in options) {
		opt[i] = options[i];
	}

	var view = Ti.UI.createView(opt);

	var commentText = Ti.UI.createLabel({
		text : sText,
		horizontalWrap : true,
		touchEnabled: false,
		font : {
			fontSize : 12
		},
		width : 280,
		height : Ti.UI.SIZE
	});

	view.add(commentText);
	return view;
};

module.exports = AutoHeightView; 