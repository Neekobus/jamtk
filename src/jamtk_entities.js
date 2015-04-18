var JAMTK = JAMTK || {};

JAMTK.Box = function() {
	this.x;
	this.y;
	this.z;

	this.width;
	this.height;
	this.depth;


};

JAMTK.Box.prototype.clone = function(){
	var clone = new JAMTK.Box();

	clone.x = this.x;
	clone.y = this.y;
	clone.z = this.z;
	clone.width = this.width;
	clone.height = this.height;
	clone.depth = this.depth;

	return clone; 
}

JAMTK.Box.make3d = function(x, y, z, w, h, d){
	var box = new JAMTK.Box();
	box.x = x;
	box.y = y;
	box.z = z;
	box.width = w;
	box.height = h;
	box.depth = d;
	return box;
};

JAMTK.Box.make = function(){
	var box = new JAMTK.Box();
	box.x = 0;
	box.y = 0;
	box.z = 0;
	box.width = 0;
	box.height = 0;
	box.depth = 0;

	return box;
};


JAMTK.Vector = function() {
	this.x;
	this.y;
	this.z;
};

JAMTK.Vector.make3d = function(x, y, z) {
	var vector = new JAMTK.Vector();

	vector.x = x;
	vector.y = y;
	vector.z = z;

	return vector;	
};

JAMTK.Vector.make = function() {
	var vector = new JAMTK.Vector();
	vector.x = 0;
	vector.y = 0;
	vector.z = 0;
	return vector;	
};


JAMTK.Vector.prototype.clone = function(){
	var clone = new JAMTK.Vector();

	clone.x = this.x;
	clone.y = this.y;
	clone.z = this.z;
	
	return clone; 
}

JAMTK.Vector.prototype.add = function(vector){
	this.x += vector.x;
	this.y += vector.y;
	this.z += vector.z;

	return this;
}

JAMTK.Vector.prototype.substract = function(vector){
	this.x -= vector.x;
	this.y -= vector.y;
	this.z -= vector.z;

	return this;
}

JAMTK.Vector.prototype.multiply = function(vector){
	this.x *= vector.x;
	this.y *= vector.y;
	this.z *= vector.z;

	return this;
}

JAMTK.Vector.prototype.scale = function(value){
	this.x *= value;
	this.y *= value;
	this.z *= value;

	return this;
}

JAMTK.Vector.prototype.normalize = function(){
	if (this.x !=0) this.x /= Math.abs(this.x);
	if (this.y !=0) this.y /= Math.abs(this.y);
	if (this.z !=0) this.z /= Math.abs(this.z);

	return this;
}

JAMTK.Vector.prototype.equals = function(vector){
	if (this.x != vector.x){
		return false;
	}
	
	if (this.y != vector.y){
		return false;
	}

	if (this.z != vector.z){
		return false;
	}

	return true;
}

JAMTK.Vector.prototype.copy = function(vector){
	this.x = vector.x;
	this.y = vector.y;
	this.z = vector.z;

	return this;
}

