var JAMTK = JAMTK || {};

JAMTK.Menu = function() {
	this.items = {};
	this.orderedItems = [];

	this.set = function(key, label, action, active){
		if (! this.items[key]) {
			this.items[key] = {};
			this.orderedItems.push(key);
		}

		this.items[key]["label"] = label;
		this.items[key]["action"] = action;
		this.items[key]["active"] = (active == undefined) ? false : active;
	}

	this.trigger = function(key) {
		if (this.items[key] && this.items[key]["action"]) {
			this.items[key]["active"] = ! this.items[key]["active"];
			this.items[key]["action"](this.items[key]["active"]);

		}
	}

	this.getLabel = function(key) {
		return this.items[key]["label"];
	}

	this.isActive = function(key) {
		return this.items[key]["active"];
	} 

	this.hasAction = function(key) {
		return this.items[key]["action"];
	}

	this.resetActives = function(){
		for (var i = 0; i < this.orderedItems.length; i++) {
			var k = this.orderedItems[i];
			this.items[k].active = false;
		};
	}

	this.markActive = function(key, value){
		this.items[key]["active"] = value;
	}

}