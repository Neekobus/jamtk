var JAMTK = JAMTK || {};

JAMTK.InputManager = function() {
	
	this.pointers = {};
	this.pressed = {};

	this.keyPressed = function(key) {
		if (this.pressed[key]) {
			return;
		}

		this.pressed[key] = Date.now();
	}

	this.keyReleased = function(key) {
		this.pressed[key] = 0;	
	}

	this.pressedSince = function(key) {
		var event = this.pressed[key];

		if (! event || event == 0) {
			return 0;
		}

		var now = Date.now();
		return now - event;
	}


	this.pointerPosition = function(key) {
		if (! this.pointers[key]) {
			this.pointers[key] = new JAMTK.Vector();	
		}

		return this.pointers[key];
	}

	this.consumeKey = function( key ){
		this.keyReleased(key);
		//todo strategy : release after
	}

};



JAMTK.InputManagerFeederMouse = function(element, pointerName) {
	this.mapper;
	this.element = element;
	this.pointerName = pointerName;

	this.onmousePressedBind;
	this.onmouseReleasedBind;

	this.activate = function() {
		this.onmousePressedBind = this.mousePressed.bind(this);
		this.onmouseReleasedBind = this.mouseReleased.bind(this);

		this.element.addEventListener("mousedown", this.onmousePressedBind);
		this.element.addEventListener("mouseup", this.onmouseReleasedBind);
	}

	this.deactivate = function() {
		this.element.removeEventListener("mousedown", this.onmousePressedBind);
		this.element.removeEventListener("mouseup", this.onmouseReleasedBind);	
	}

	this.mousePressed = function(event){
		var calculatedPosition = this.screenCanvasOffset( event.pageX, event.pageY );

		this.mapper.setPointerPosition(this.pointerName, calculatedPosition);
		this.mapper.keyPressed( this.pointerName );
	}

	this.mouseReleased = function(event){
		this.mapper.keyReleased( this.pointerName );
	}


	this.screenCanvasOffset = function(x, y) {
		
		var offset = this.findPos(this.element);
		x -= offset.x;
		y -= offset.y;

		
		return {"x": x, "y" : y};
	}

	this.findPos = function(obj) {
		var curleft = curtop = 0;
		if (! obj.offsetParent) {
			return undefined;
		}

		do {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
		} while (obj = obj.offsetParent);

		return {"x": curleft, "y" : curtop};

	}
}


JAMTK.InputManagerFeederTouch = function() {
	this.mapper;

	this.activate = function() {
		//this.canvas.addEventListener("touchstart", this.canvasPressed.bind(this));	
		//this.canvas.addEventListener("touchend", this.canvasReleased.bind(this));		
	}

	this.deactivate = function() {
		
	}
}

JAMTK.InputManagerFeederKeyboard = function() {
	this.mapper;

	this.onKeyUpBind;
	this.onKeyDownBind;

	this.keyCodeToKey = {
		32 : "KEYBOARD_SPACE",
		16 : "KEYBOARD_SHIFT",
		37 : "KEYBOARD_LEFT",
		38 : "KEYBOARD_UP",
		39 : "KEYBOARD_RIGHT",
		40 : "KEYBOARD_DOWN",
	};

	this.activate = function() {
		this.onKeyUpBind = this.onKeyUp.bind(this);
		this.onKeyDownBind = this.onKeyDown.bind(this);

  		window.addEventListener('keyup', this.onKeyUpBind, false);
  		window.addEventListener('keydown', this.onKeyDownBind , false);
	}

	this.deactivate = function() {
		window.removeEventListener('keyup', this.onKeyUpBind);
 		window.removeEventListener('keydown', this.onKeyDownBind);
	}

	this.onKeyUp = function(event) {
		if ( this.keyCodeToKey[ event.keyCode ] ) {
			this.mapper.keyReleased( this.keyCodeToKey[ event.keyCode ] );
		}
	}

	this.onKeyDown = function(event){
		if ( this.keyCodeToKey[ event.keyCode ] ) {
			this.mapper.keyPressed( this.keyCodeToKey[ event.keyCode ] );
		}
	}
}

JAMTK.InputManagerFeederIcade = function() {
	this.mapper;

	this.activate = function() {
		
	}

	this.deactivate = function() {
		
	}
}

JAMTK.InputManagerMapper = function() {
	this.inputManager = new JAMTK.InputManager();
	this.feeders = [];

	this.mapping = {};
	this.pointerCallback = {};

	this.activate = function() {
		
		for (var i = 0; i < this.feeders.length; i++) {
			this.feeders[i].activate();
		};
	}

	this.deactivate = function() {
		for (var i = 0; i < this.feeders.length; i++) {
			this.feeders[i].deactivate();
		};	
	}	

	this.addFeeder = function(feeder){
		feeder.mapper = this;
		this.feeders.push(feeder);
	}

	this.map = function(key, action) {
		this.mapping[ key ] = action;
	}

	this.keyPressed = function(key) {

		if (this.mapping[ key ]) {
			this.inputManager.keyPressed( this.mapping[ key ] );
		}
	}

	this.keyReleased = function(key) {
		if (this.mapping[ key ]) {
			this.inputManager.keyReleased( this.mapping[ key ] );
		}
	}

	this.setPointerPosition = function(key, position) {

		if ( this.pointerCallback[ key ] ){
			position = this.pointerCallback[ key ].convertPointerPosition( key, position );
		}

		var vector = this.inputManager.pointerPosition(key);
		vector.copy(position);

	}

	this.addPointerPositionCallback = function(key, callback){
		this.pointerCallback[ key ] = callback;
	}


}