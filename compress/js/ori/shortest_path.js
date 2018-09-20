var DiVertex = new function() {
	this.id;
	this.name;

	this.createDiVertex = function(id, name) {
		this.id = id;
		this.name = name;
	};
	this.getId = function() {
		return this.id;
	};

	this.getName = function() {
		return this.name;
	};
	this.hashCode = function() {
		var prime = 31;
		var result = 1;
		result = prime * result + ((this.id == null) ? 0 : this.id.hashCode());
		return result;
	};
	this.equals = function(obj) {
		if (this.id == obj.id)
			return true;
		else
			return false;
	};
	this.toString = function() {
		return this.name;
	};
};

var DiEdge = new function() {
	this.id;
	this.source;
	this.destination;
	this.weight;
	this.createDiEdge = function(id, source, destination, weight) {
		this.id = id;
		this.source = source;
		this.destination = destination;
		this.weight = weight;
	};
	this.getId = function() {
		return this.id;
	};
	this.getDestination = function() {
		return this.destination;
	};
	this.getSource = function() {
		return this.source;
	};
	this.getWeight = function() {
		return this.weight;
	};
	this.toString = function() {
		return this.source + " " + this.destination;
	};
};

var DiGraph = new function() {
	this.vertexes;
	this.edges;

	this.createDiGraph = function(vertexes, edges) {
		this.vertexes = vertexes;
		this.edges = edges;
	};

	this.getVertexes = function() {
		return this.vertexes;
	};

	this.getEdges = function() {
		return this.edges;
	};

};

var DijkstraAlgorithm = new function() {

	this.nodes;// list
	this.edges;// list
	this.settledNodes;// set
	this.unSettledNodes;// set
	this.predecessors; // obj
	this.distance; // obj

	this.createDijkstraAlgorithm = function(graph) {
		// create a copy of the array so that we can operate on this array
		this.nodes = $.extend(true, [], graph.getVertexes());
		this.edges = $.extend(true, [], graph.getEdges());
	};

	this.execute = function(source) {
		this.settledNodes = [];// set;
		this.unSettledNodes = [];
		this.distance = {};
		this.predecessors = {};
		this.distance[source] = 0;
		this.pushToSet(this.unSettledNodes, source);
		// this.unSettledNodes.push(source);
		while (this.unSettledNodes.length > 0) {
			var node = this.getMinimum(this.unSettledNodes);
			this.pushToSet(this.settledNodes, node);
			// this.settledNodes.push(node);
			// this.unSettledNodes.remove(node);
			var index = this.unSettledNodes.indexOf(node);
			this.unSettledNodes.splice(index, 1);

			this.findMinimalDistances(node);
		}
	};
	//
	this.findMinimalDistances = function(node) {
		var adjacentNodes = this.getNeighbors(node);
		for (key in adjacentNodes) {
			var target = adjacentNodes[key];
			if (this.getShortestDistance(target) > this
					.getShortestDistance(node)
					+ this.getDistance(node, target)) {
				this.distance[target] = (this.getShortestDistance(node) + this
						.getDistance(node, target));
				this.predecessors[target] = node;
				this.pushToSet(this.unSettledNodes, target);
				// this.unSettledNodes.push(target);
			}
		}
	};
	//
	this.getDistance = function(node, target) {
		for (key in this.edges) {
			var edge = this.edges[key];
			if ((edge.getSource().id == node.id && edge.getDestination().id == target.id)
					|| (edge.getSource().id == target.id && edge
							.getDestination().id == node.id)) {
				return edge.getWeight();
			}
		}
		console.log("Error, Should not happen");
	};
	//
	this.getNeighbors = function(node) {
		var neighbors = [];
		for (key in this.edges) {
			var edge = this.edges[key];

			if (edge.getSource().id == node.id
					&& !this.isSettled(edge.getDestination())) {
				this.pushToSet(neighbors, edge.getDestination());
				// neighbors.push(edge.getDestination());

			} else if (edge.getDestination().id == node.id
					&& !this.isSettled(edge.getSource())) {
				// neighbors.push(edge.getSource());
				this.pushToSet(neighbors, edge.getSource());
			}
		}
		return neighbors;
	};
	//
	this.getMinimum = function(vertexes) {
		var minimum = null;
		for (key in vertexes) {
			var vertex = vertexes[key];
			if (minimum == null) {
				minimum = vertex;
			} else {
				if (this.getShortestDistance(vertex) < this
						.getShortestDistance(minimum)) {
					minimum = vertex;
				}
			}
		}
		return minimum;
	};
	// push vertex to a set if not exists already
	this.pushToSet = function(set, vertex) {
		var isExist = false;
		for (var i = 0; i < set.length; i++) {
			if (set[i].id == vertex.id) {
				isExist = true;
				break;
			}
		}
		if (isExist == false) {
			set.push(vertex);
		}
		// return this.settledNodes.includes(vertex);
	};

	this.isSettled = function(vertex) {
		for (var i = 0; i < this.settledNodes.length; i++) {

			if (this.settledNodes[i].id == vertex.id)
				return true;
		}
		return false;
		// return this.settledNodes.includes(vertex);
	};
	//
	this.getShortestDistance = function(destination) {
		var d = this.distance[destination];
		if (d == null) {
			return Number.MAX_VALUE;
		} else {
			return d;
		}
	};
	//
	/*
	 * This method returns the path from the source to the selected target and
	 * NULL if no path exists
	 */
	this.getPath = function(target) {
		var path = [];
		var step = target;
		// check if a path exists
		if (this.predecessors[step] == null
				|| typeof this.predecessors[step] == "undefined") {
			return {
				path : null,
				distance : null
			};
		}
		path.push(step);
		while (typeof this.predecessors[step] != "undefined") {
			step = this.predecessors[step];
			path.push(step);
		}
		// Put it into the correct order
		path.reverse();
		// Collections.reverse(path);
		var distance = this.getShortestDistance(target);
		return {
			path : path,
			distance : distance
		};
	};

};