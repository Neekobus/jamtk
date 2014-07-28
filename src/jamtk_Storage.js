var JAMTK = JAMTK || {};

JAMTK.Storage = function() {
	this.strategy = new JAMTK.CookieStorage();

	this.get = function(key,defaultValue) {
		return this.strategy.get(key,defaultValue);
	};

	this.set = function(key, value) {
		return this.strategy.set(key, value);
	};

	this.clear = function(key) {
		return this.strategy.clear(key);
	};

}

JAMTK.CookieStorage = function(){

	this.get = function(key,defaultValue) {
		var name = key + "=";
		var cookies = document.cookie.split(';');
		
		for(var i=0; i < cookies.length; i++) {
			var c = cookies[i].trim();
			if (c.indexOf(key)==0) {
				return parseInt( c.substring(name.length, c.length) );
			} 
		}
		
		return defaultValue;
	}

	this.set = function(key, value) {
		var d = new Date();
		d.setTime(d.getTime()+( 100 *24*60*60*1000));
		var expires = "expires="+d.toGMTString();

		document.cookie = key + "=" + value + "; " + expires;
	}

	this.clear = function(key) {
		var past = new Date();
		past.setTime(10);
		var expires = "expires="+past.toGMTString();

		document.cookie = key + "=; " + expires;
	}

}
	

