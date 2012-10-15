var getRemoteFile = function(filename, url, fn_end, fn_progress) {
	var file_obj = {
		file : filename,
		url : url,
		path : null
	};

	var file = Titanium.Filesystem.getFile(Ti.Filesystem.tempDirectory, filename);
	if (file.exists()) {
		file_obj.path = Ti.Filesystem.tempDirectory + Titanium.Filesystem.separator;
		fn_end(file_obj);
	} else {

		if (Titanium.Network.online) {
			var c = Titanium.Network.createHTTPClient();

			c.setTimeout(10000);
			c.onload = function() {

				if (c.status == 200) {

					var f = Titanium.Filesystem.getFile(Ti.Filesystem.tempDirectory, filename);
					f.write(this.responseData);
					file_obj.path = Ti.Filesystem.tempDirectory + Titanium.Filesystem.separator;
				} else {
					file_obj.error = 'file not found';
					// to set some errors codes
				}
				fn_end(file_obj);

			};
			c.ondatastream = function(e) {

				if (fn_progress)
					fn_progress(e.progress);
			};
			c.error = function(e) {

				file_obj.error = e.error;
				fn_end(file_obj);
			};
			c.open('GET', url);
			c.send();
		} else {
			file_obj.error = 'no internet';
			fn_end(file_obj);
		}

	}
};