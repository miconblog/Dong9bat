function TitleLabel(title) {
	return Ti.UI.createLabel({
		text : title,
		font : {
			fontFamily : "NanumGothic",
			fontWeight : "bold"
		},
		color : '#6d2c00',
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		top : 0,
		left : 0,
		width : 320,
		height : 30
	});
};
module.exports = TitleLabel;
