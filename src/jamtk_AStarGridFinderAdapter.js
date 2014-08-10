var JAMTK = JAMTK || {};

/**
* Works with a 2D vector grid.
*/
JAMTK.AStarGridFinderAdapter = function(grid, delegate) {

	this.delegate = delegate;
	this.finder = new JAMTK.AStarGraphFinder(this);

	this.grid = grid;
	this.cellsById = {};

	this.options = [ 
		JAMTK.Vector.make3d(1,	0, 0),
		JAMTK.Vector.make3d(-1, 0, 0),
		JAMTK.Vector.make3d(0, 	1, 0),
		JAMTK.Vector.make3d(0, -1, 0),
	];

	this.buildCellsId = function(grid){
		for (var line = 0; line < grid.length; line++) {
			for (var col = 0; col < grid[line].length; col++) {
				var cell = grid[line][col];
				this.cellsById[ this.identifyCell(cell) ] = cell;
			};
		};
	}

	this.identifyCell = function(cell){
		return "x:" + cell.x + "y:" + cell.y + "z:" + cell.z;
	}

	this.isValid = function(cell) {

		if (cell.x < 0 || cell.y < 0 || cell.z < 0){
			return false;
		}

		var maxX = this.grid.length - 1;
		var maxY = this.grid[0].length - 1;
		var maxZ = 0;	

		if (cell.x > maxX || cell.y > maxY  || cell.z > maxZ ){
			return false;
		}


		return true;
	}

	this.getNeighbours = function(identifier){
		var current = this.cellsById[identifier];
		var neighbours = [];

		if (!current) {
			return neighbours;
		}

		for (var i = 0; i < this.options.length; i++) {
			var option = this.options[i].clone();
			var neighbour = option.add(current);

			if (! this.isValid(neighbour)){
				continue;
			}

			neighbours.push( this.identifyCell(neighbour) );
		};
		
		return neighbours;
	};
	
	this.getHeuristic = function(fromId, toId){
		var from = this.cellsById[fromId];
		var to = this.cellsById[toId];

		return 2 * (Math.abs(from.x - to.x) + Math.abs(from.y - to.y) + Math.abs(from.z - to.z));
	};
	
	this.getCost = function(cell){
		if (! this.delegate.getCost) {
			return 0;
		}

		return this.delegate.getCost(cell);		
	}

	this.failToReachDestination = function(){
		if (! this.delegate.failToReachDestination) {
			return;
		}

		this.delegate.failToReachDestination();
	};

	this.hasBeenVisited = function(identifier){
		if (! this.delegate.hasBeenVisited) {
			return;
		}

		var cell = this.cellsById[identifier];
		this.delegate.hasBeenVisited( cell );
	};
	
	this.destinationReached = function(path){
		var cells = [];
		
		for (var i = 0; i < path.length; i++) {
			var cell = this.cellsById[ path[i] ];
			cells.push(cell);
		};

		this.delegate.destinationReached(cells);
	};

	this.find = function(originCell, destinationCell){
		this.buildCellsId(this.grid);
		this.finder.find( this.identifyCell(originCell), this.identifyCell(destinationCell) );
	}
	
}

	
