var JAMTK = JAMTK || {};

JAMTK.JsonLevelLoader = function(patternUrl) {
	this.patternUrl = patternUrl; //string with %id%
	this.jsonToLevelCallback = function(){ console.error("You must define jsonToLevelCallback.") };
	this.levelLoadedCallback = function(){ console.error("You must define levelLoadedCallback.") };;
	
	this.errorCallback = function (message){
		console.error(message);
	};

	this.loadLevel = function(id){
		var url = this.patternUrl.replace("%id%", id);

		var self = this;

		var httpRequest = new XMLHttpRequest();
		httpRequest.open("GET", url, true);
		httpRequest.onprogress = function(e){self.onProgress(e);};
		httpRequest.onerror 	= function(e){self.onError(e);};
		httpRequest.onload 	= function(e){self.onLoad(e);};
		httpRequest.send();
	}

	this.onProgress = function(e) {
  		var percentComplete = (e.loaded / e.total) * 100;
  		console.log("Loading level : " + percentComplete + "%.");
	}

	this.onError = function(e) {
	  var msg = "Error " + e.target.status + " while loading level.";
	  this.errorCallback(msg);
	}

	this.onLoad = function(e) {
		var jsonResponse = JSON.parse(e.target.responseText);
		var level = this.jsonToLevelCallback(jsonResponse);
		this.levelLoadedCallback(level);
	}

}