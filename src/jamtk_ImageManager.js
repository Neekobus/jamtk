var JAMTK = JAMTK || {};

JAMTK.ImageManagerHelperFiles = function() {
	this.loadImage = function(key, index){
		return document.getElementById(key);
	}

	this.imageIndex = function(key, tick) {
		return 0;
	}
}

JAMTK.ImageManagerHelperSpriteSheet = function(path) {

	this.jsonFile =  path + ".json";
	this.imageFile = path + ".png";

	var localLog = function(message) {
		//log(message);
	}

	this.httpRequest = new XMLHttpRequest();

	this.jsonLoaded = false;
	this.sheetLoaded = false;

	this.httpRequest.open("GET", this.jsonFile, true);
	this.httpRequest.onload = function(e){
		localLog("Sprite JSON ready");
		this.jsonLoaded = true;

		this.data = JSON.parse(this.httpRequest.responseText);

	}.bind(this);

	this.httpRequest.send();

	this.sheet = new Image();
	this.sheet.src = this.imageFile;

	this.sheet.onload = function(e){
		localLog("Sprite sheet ready");
		this.sheetLoaded = true;
	}.bind(this);
	

	
	this.loadImage = function(key, index){
		localLog("key " + key);
		localLog("index " + index);
		var canvas = document.createElement('canvas');
		
		var x = this.data[key][index]['x'];
		var y = this.data[key][index]['y'];
		var w = this.data[key][index]['width'];
		var h = this.data[key][index]['height'];

		var context = canvas.getContext("2d");
		
		canvas.width  = w;
		canvas.height = h;

		context.drawImage(this.sheet, x, y, w, h, 0, 0, w, h);
		return canvas;
	}

	this.imageIndex = function(key, tick) {
		
		if (this.data[key] == undefined) {
			localLog("Image not found : " + key );
			return null;
		}

		var index = 0;
		var count = this.data[key].length;
		index = tick % count;

		localLog("tick : " + tick);
		localLog("load image for index : " + index + " on " + count);

		if (this.data[key][index] == undefined) {
			localLog("image not found for index : " + index);
			return null;
		}

		return index;

	}
}

JAMTK.ImageManager = function(helperName, helperParam) {

	this.cache = {};

	if (helperName == "sprite") {
		this.helper = new JAMTK.ImageManagerHelperSpriteSheet(helperParam);	
	} else {
		this.helper = new JAMTK.ImageManagerHelperFiles(helperParam);	
	}
	
	this.tick = 0;
	this.timer;

	this.enableAnimation = function(frameDuration){
		var that = this;
		this.timer = window.setInterval( function(){  
			that.tick ++;
		}, frameDuration );
	}

	this.disableAnimation = function(){
		window.clearInterval(this.timer);
	}

	var localLog = function(message) {
		//log(message);
	}

	this.getImage = function(category, type, variant){

		var key = category;
		if (type != undefined) 		key += "-" + type;
		if (variant != undefined) 	key += "-" + variant;

		var index = this.helper.imageIndex(key, this.tick);
		var completeKey = key + "-" + index;

		localLog("image manager : getImage : " + completeKey);

		if (this.cache[completeKey] == undefined) {
			this.cache[completeKey] = this.helper.loadImage(key, index);
			localLog("keep in cache");
		} else {
			localLog("already cached");
		}

		return this.cache[completeKey];
	}

}
