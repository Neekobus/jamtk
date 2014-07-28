var JAMTK = JAMTK || {};

/**
	delegate.getNeighbours(id) //mandatory, must return array of ids
	
	delegate.destinationReached(array ids) //mandatory
	delegate.getHeuristic(fromCellId, toCellId) //optionnal
	delegate.failToReachDestination() //optionnal
	delegate.hasBeenVisited(id) //optionnal
*/

JAMTK.AStarGraphFinder = function(delegate) {
	this.delegate = delegate;
	this.excludeStartNode = false;

	this.checkDelegate = function(){
		if (! this.delegate.getNeighbours || ! this.destinationReached) {
			return false;
		}

		return true;
	}

	this.getHeuristic = function(fromNode, toNode){
		if (! this.delegate.getHeuristic) {
			return 0;
		}
		
		return this.delegate.getHeuristic(fromNode.identifier, toNode.identifier);
		
	}

	this.cheapestNode = function(list){
		var cheapestValue;
		var cheapest;

		for (var i = 0; i < list.length; i++) {
			var currentValue = list[i].cost + list[i].heuristic;

			if (cheapest == null || currentValue < cheapestValue){ 
				cheapest = list[i];
				cheapestValue = currentValue;
			}
		};

		return cheapest;
	}

	this.exportPath = function(currentNode){
		var path = [];
		path.push(currentNode.identifier);

		var p = currentNode.parentNode;

		while(p){
			path.push(p.identifier);
			p = p.parentNode;

		}

		if (this.excludeStartNode) {
			path.pop();	
		}
		
		return path.reverse();
	}

	this.inArray = function(array, cell) {
		var count = array.length;

		for (var i = 0; i < count; i++) {
			if (cell.isSame( array[i] )) {
				return true;
			}
		};

		return false;
	}

	this.makeNode = function(cellIdentifier) {
		return new JAMTK.AStarGraphNode(cellIdentifier);
	}

	this.failToReachDestination = function(){
		if (this.delegate.failToReachDestination) {
			this.delegate.failToReachDestination();
		}

		return false;
	}

	this.destinationReached = function(currentNode, numberOfSteps){
		var path = this.exportPath(currentNode);
		this.logNode("Reached destination in " + numberOfSteps + " steps.", currentNode);
		this.delegate.destinationReached(path);
		return true;
	}

	this.getNeighbours = function(currentNode){
		return this.delegate.getNeighbours(currentNode.identifier);
	}

	this.logNode = function(message, node) {
		console.log("AStarGraphFinder : " + message + " " + node.toString());
	}

	this.hasBeenVisited = function(node){
		if (this.delegate.hasBeenVisited) {
			this.delegate.hasBeenVisited(node.identifier);
		}
	}

	this.find = function(originCellId, destinationCellId){
		
		if (! this.checkDelegate()){
			return false;
		}

		if (! originCellId || ! destinationCellId) {
			return false;
		}

		var maxLoops = 50;
		var currentLoop = 0;

		var originNode 		= this.makeNode(originCellId);
		var destinationNode = this.makeNode(destinationCellId);

		this.logNode("Starting at", originNode);
		this.logNode(" ... to destination", destinationNode);

		if (originNode.isSame(destinationNode)){
			return false;
		}

		var openList = [];
		var closedList = [];

		var adj;
		var currentNode;
		
		openList.push(originNode);

		while(openList.length > 0) {

			currentLoop ++;
			if (currentLoop > maxLoops) {
				return this.failToReachDestination();
			}

			currentNode = this.cheapestNode(openList);
			this.logNode("Processing", currentNode);
			this.hasBeenVisited(currentNode);

			if (currentNode.isSame(destinationNode)){
				return this.destinationReached(currentNode, currentLoop);
			}

			this.logNode("Remove from openlist", currentNode);
			openList.splice(openList.indexOf(currentNode), 1);

			this.logNode("Add to closedlist", currentNode);
			closedList.push(currentNode);

			var options = this.getNeighbours(currentNode);
			for (var i = 0; i < options.length; i++) {
				
				var adj = this.makeNode(options[i]);
				adj.cost = currentNode.cost + 1; 
				adj.heuristic = this.getHeuristic(adj, destinationNode);

				this.logNode("Check Adjacents cells", adj);
				
				if ( this.inArray(openList, adj) || this.inArray(closedList, adj)) {
					this.logNode("Adjacent already checked", adj);
					continue;
				}

				this.logNode("Adjacent is new", adj);
				this.logNode("Adding Adjacent to openlist", adj);					

				adj.parentNode = currentNode;
				openList.push(adj);

			};
			


		}



	} 
}

JAMTK.AStarGraphNode = function(identifier){
	this.identifier = identifier;

	this.cost = 0;
	this.heuristic = 0;
	this.parentNode;

	this.isSame = function (otherNode) {
		if (otherNode.identifier != this.identifier) {
			return false;
		}

		return true;
	}

	this.toString = function(){
		return "Node id=[" + this.identifier + "] (cost=" + this.cost + " + heur=" + this.heuristic + ")";
	}

}
