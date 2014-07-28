var JAMTK = JAMTK || {};

JAMTK.DomHelper = function() {

}

JAMTK.DomHelper.getElementPosition = function(element) {
	var curleft = curtop = 0;
	
	if (! element || ! element.offsetParent) {
		return undefined;
	}

	do {
		curleft += element.offsetLeft;
		curtop += element.offsetTop;
	} while (element = element.offsetParent);

	return {"x": curleft, "y" : curtop};
}

JAMTK.DomHelper.getRelativePosition = function(element, x, y) {
	var offset = JAMTK.DomHelper.getElementPosition(element);
	x -= offset.x;
	y -= offset.y;

	return {"x": x, "y" : y};
}
