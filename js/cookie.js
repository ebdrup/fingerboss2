function writeCookie(name, value, days) {
	days = days || 365 * 10;
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		var expires = "; expires=" + date.toGMTString();
	}
	else var expires = "";
	document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var s = ca[i];
		while (s.charAt(0) == ' ') s = s.substring(1, s.length);
		if (s.indexOf(nameEQ) == 0) return s.substring(nameEQ.length, s.length);
	}
	return null;
}

function eraseCookie(name) {
	writeCookie(name, "", -1);
}