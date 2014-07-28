var JAMTK = JAMTK || {};

JAMTK.InputManager = function() {
	
	this.pointers = {};
	this.pressed = {};
	this.listeners = {};

	this.keyPressed = function(key) {
		if (this.pressed[key]) {
			return;
		}

		this.pressed[key] = Date.now();
		this.triggerListeners(key, false);
	}

	this.keyReleased = function(key) {
		this.consumeKey(key);
		this.triggerListeners(key, true);
	}

	this.consumeKey = function( key ){
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

	this.addEventListener = function(key, callback) {
		if(! this.listeners[key]) {
			this.listeners[key] = [];
		}

		this.listeners[key].push(callback);

	}

	this.triggerListeners = function(key, isRelease){
		if(! this.listeners[key]) {
			return;
		}

		for (var i = 0; i < this.listeners[key].length; i++) {
			this.listeners[key][i](key, this, isRelease);
		};

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
		var calculatedPosition = JAMTK.DomHelper.getRelativePosition( this.element, event.pageX, event.pageY );

		this.mapper.setPointerPosition(this.pointerName, calculatedPosition);
		this.mapper.keyPressed( this.pointerName );
	}

	this.mouseReleased = function(event){
		this.mapper.keyReleased( this.pointerName );
	}


	
}


JAMTK.InputManagerFeederTouch = function(element, pointerName) {
	this.mapper;
	this.element = element;
	this.pointerName = pointerName;

	this.onmousePressedBind;
	this.onmouseReleasedBind;

	this.activate = function() {
		this.onmousePressedBind = this.mousePressed.bind(this);
		this.onmouseReleasedBind = this.mouseReleased.bind(this);

		this.element.addEventListener("touchstart", this.onmousePressedBind);
		this.element.addEventListener("touchend", this.onmouseReleasedBind);
	}

	this.deactivate = function() {
		this.element.removeEventListener("touchstart", this.onmousePressedBind);
		this.element.removeEventListener("touchend", this.onmouseReleasedBind);	
	}

	this.mousePressed = function(event){
		var touch = event.changedTouches[0];
		var calculatedPosition = JAMTK.DomHelper.getRelativePosition( this.element, touch.pageX, touch.pageY );

		this.mapper.setPointerPosition(this.pointerName, calculatedPosition);
		this.mapper.keyPressed( this.pointerName );
	}

	this.mouseReleased = function(event){
		this.mapper.keyReleased( this.pointerName );
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
			position = this.pointerCallback[ key ]( key, position );
		}

		var vector = this.inputManager.pointerPosition(key);
		vector.copy(position);

	}

	this.addPointerPositionCallback = function(key, callback){
		this.pointerCallback[ key ] = callback;
	}


}