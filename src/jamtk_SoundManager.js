var JAMTK = JAMTK || {};

JAMTK.SoundManager = function(path, extension, sounds) {
	this.path = path;
	this.extension = extension;

	this.available;

	this.context;
	this.buffers = sounds;

	this.gains = [];

	this.init = function() {

		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		
		if (window.AudioContext == undefined) {
			console.log("AudioContext not available.");
			this.available = false;
			return;
		}

		this.available = true;
		this.context = new AudioContext();

		for(var key in this.buffers){
			var url = this.path + key + "." + this.extension;
			this.buffers[key].loader = new JAMTK.SoundLoader(this.context, key, url);
			this.buffers[key].loader.onBufferReady = this.soundReady.bind(this);
			this.buffers[key].loader.load();
		}


	};

	this.soundReady = function(key, buffer){
		this.buffers[key].buffer = buffer;
		if (this.buffers[key].wantsPlay) {
			this.play(key);
		}
		
	}

	this.mute = function() {
		for (var i = 0; i < this.gains.length; i++) {
			this.gains[i].gain.value = 0;
		};
	}

	this.play = function(key) {

		if (! this.available) {
			return;
		}

		if (! this.buffers[key]) {
			return;
		}

		var buffer = this.buffers[key].buffer;

		if (!buffer) {
			this.buffers[key].wantsPlay = true;
			return;
		}

		if (this.buffers[key].playing) {
			return;
		}

		var source = this.context.createBufferSource(); // creates a sound source
		source.buffer = buffer;                    // tell the source which sound to play

		

		
		var gainNode = this.context.createGain();

		source.connect(gainNode);
		gainNode.connect(this.context.destination);
		gainNode.gain.value = 0.5;
		
		source.start(0); 
		
		this.gains.push(gainNode);


		source.onended = function(){
			this.buffers[key].playing=false;
			
			if (this.buffers[key].loop){
				this.play(key);
			}

		}.bind(this);

		this.buffers[key].playing=true;
	}

};



JAMTK.SoundLoader = function(context, key, url){
	this.context = context;
	this.url = url;
	this.key = key;
	this.request;

	this.onBufferReady;

	this.load = function() {
		this.request = new XMLHttpRequest();
  		this.request.open('GET', this.url, true);
  		this.request.responseType = 'arraybuffer';
  		this.request.onload = this.dataLoad.bind(this);
  		this.request.send();
	}

	this.dataLoad = function(event) {
		this.context.decodeAudioData(this.request.response, this.decodeSuccess.bind(this), this.decodeError.bind(this));
	}

	this.decodeSuccess = function(buffer) {
		this.onBufferReady(this.key, buffer);
	}

	this.decodeError = function(buffer) {
		console.log("ERROR");
	}
}



