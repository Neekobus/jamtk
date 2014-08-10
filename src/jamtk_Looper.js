var JAMTK = JAMTK || {};

JAMTK.Looper = function() {

	this.frameNumber = 0;
	this.elapsedTime = 0;
	this.timeInterval=0;
	this.callback;

	this.lastTime = 0;

	this.interval;

	this.start = function(){
		this.lastTime = Date.now();
		this.interval = window.setInterval(this.step.bind(this), this.timeInterval);
	}

	this.step = function(){
		var now = Date.now();
		this.elapsedTime = now - this.lastTime;

		this.callback(this);

		this.lastTime = Date.now();
		this.frameNumber ++;
	}	

	this.stop = function(){
		window.clearInterval(this.interval);
		this.interval = null;
	}
}