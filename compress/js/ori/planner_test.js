/**
 * Generic class to represent a graph. Also contains several static functions
 * for some useful graph operations
 * 
 * 
 */
var Graph = new function() {

	// /** Maps vertices to a set containing all adjacent vertices. */
	this.adjacencyMap = {};
	//
	// /** Default constructor for a graph. */
	// public Graph() {}
	//

	this.createGraphFromEdges = function(edgeLists) {
		for (var i = 0; i < edgeLists.length; i++) {
			var node1 = edgeLists[i].source;
			var node2 = edgeLists[i].target;
			// don't include self loops
			if (node1 == node2)continue;
			
			this.addEdge(node1, node2);

		}
	};
	/**
	 * Constructs a graph identical to the given graph.
	 * 
	 * @param source
	 *            The graph to copy.
	 */
	// public Graph( Graph<T> source ) {
	this.createGraph = function(source) {
		var nodesList = source.getVertices();
		for (v in nodesList) {
			var neighborsList = source.getNeighbors(nodesList[v]);
			for (u in neighborsList) {
				this.addEdge(nodesList[v], neighborsList[u]);
			}
		}
	};
	//
	/**
	 * Adds a vertex to the graph.
	 * 
	 * @param v
	 *            The vertex to add.
	 */
	this.addVertex = function(v) {
		if (typeof this.adjacencyMap[v] == "undefined") {
			this.adjacencyMap[v] = [];
		}
	};
	//
	/**
	 * Adds an undirected edge between two vertices.
	 * 
	 * @param v1
	 *            One endpoint of the edge to add.
	 * @param v2
	 *            The other endpoint of the edge.
	 */
	this.addEdge = function(v1, v2) {
		this.addVertex(v1);
		this.addVertex(v2);
		if (!this.adjacencyMap[v1].includes(v2))
			this.adjacencyMap[v1].push(v2);
		if (!this.adjacencyMap[v2].includes(v1))
			this.adjacencyMap[v2].push(v1);
	};
	//
	/**
	 * Removes an undirected edge from between two vertices.
	 * 
	 * @param v1
	 *            One endpoint of the edge to remove.
	 * @param v2
	 *            The other endpoint of the edge.
	 */
	this.removeEdge = function(v1, v2) {
		if (this.hasEdge(v1, v2) && this.hasEdge(v2, v1)) {
			var neighborsList = this.adjacencyMap[v1];
			var index = neighborsList.indexOf(v2);
			if (index > -1) {
				neighborsList.splice(index, 1);
			}
			this.adjacencyMap[v1] = neighborsList;

			//
			var neighborsList = this.adjacencyMap[v2];
			var index = neighborsList.indexOf(v1);
			if (index > -1) {
				neighborsList.splice(index, 1);
			}
			this.adjacencyMap[v2] = neighborsList;

			if (this.adjacencyMap[v1].length == 0)
				delete this.adjacencyMap[v1];
			if (this.adjacencyMap[v2].length == 0)
				delete this.adjacencyMap[v2];
		}
	};
	//
	/**
	 * @return The number of vertices in the graph.
	 */
	this.numVertices = function() {
		var count = 0;
		for (key in this.adjacencyMap) {
			count++;
		}
		return count;
	};
	//
	/**
	 * @return The number of edges in the graph.
	 */
	this.numEdges = function() {

		var count = 0;
		// iterate over the hashmap's keys counting edges
		for (key in this.adjacencyMap) {
			var listOfEdges = this.adjacencyMap[key];
			count += listOfEdges.length;
		}
		return count / 2;
	};
	//
	/**
	 * Gets all the neighbors of a given node.
	 * 
	 * @param v
	 *            The vertex whose neighbors to get.
	 * @return A set containing all of the vertex's neighbors.
	 */
	this.getNeighbors = function(v) {
		if (this.adjacencyMap[v]) {
			return this.adjacencyMap[v];
		} else {
			return [];
		}
	};
	//
	/**
	 * @param v
	 *            A vertex.
	 * @return The degree (number of neighbors) of the given vertex, or -1 if no
	 *         such vertex exists in this graph.
	 */
	this.getDegree = function(v) {
		if (this.adjacencyMap[v]) {
			return this.adjacencyMap[v].length;
		} else {
			return -1;
		}
	};
	//
	/**
	 * @return A set containing all the vertices of this graph.
	 */
	this.getVertices = function() {
		var listOfNodes = [];
		for ( var nodeId in this.adjacencyMap) {
			listOfNodes.push(nodeId);
		}
		return listOfNodes;
	};
	//
	/**
	 * @param v
	 *            A vertex.
	 * @return Whether the given vertex is in this graph.
	 */
	this.hasVertex = function(v) {
		if (this.adjacencyMap[v]) {
			return true;
		} else {
			return false;
		}
		// return adjacencyMap.containsKey( v );
	};
	//
	/**
	 * @param v
	 *            A vertex.
	 * @return Whether the given vertex is in this graph.
	 */
	this.hasEdge = function(v1, v2) {
		if (this.adjacencyMap[v1] && this.adjacencyMap[v1].includes(v2)) {
			return true;
		} else
			return false;
		// return adjacencyMap.containsKey(v1)
		// && adjacencyMap.get(v1).contains(v2);
	};
	//
	/** Prints out this graph to System.out */
	this.print = function() {
		console.log('');
		var string = "";
		for (k in this.adjacencyMap) {
			string = (k + ":");
			var list = this.adjacencyMap[k];
			for (v in list) {
				string += (" " + list[v]);
			}
			console.log(string);
		}
	};
	//
	// Static Methods

	/**
	 * Tests whether a connected graph is a cycle.
	 * 
	 * @param graph
	 *            The graph to test.
	 * @return Whether it is a cycle or not.
	 */
	this.isCycle = function(graph) {
		var isCycle = graph.numVertices() > 2;
		var nodeLists = graph.getVertices();
		for (v in nodeLists) {
			isCycle = isCycle && graph.getDegree(nodeLists[v]) == 2;
		}
		return isCycle;
	};
	//
	// /**
	// * Tests whether a connected graph is a path.
	// *
	// * @param graph
	// * The graph to test.
	// * @return Whether it is a path or not.
	// */
	// this.isPath = function(graph) {
	// var start = null;
	// var endPoints = 0;
	// var nodeLists = graph.getVertices();
	// for (v in nodeLists) {
	// var degree = graph.getDegree(nodeLists[v]);
	// if (degree == 1) {
	// endPoints++;
	// } else if (degree != 2) {
	// return false;
	// }
	// }
	// if (endPoints != 2)
	// return false;
	// return true;
	// };
	//
	// /**
	// * Tests whether a connected graph is a bipartite.
	// *
	// * @param graph
	// * The graph to test.
	// * @return Whether it is bipartite or not.
	// */
	// this.isBipartite = function(graph) {
	// // return (new GraphTraverser < T > (graph)).isBipartite();
	// var graphTraverser = $.extend(true, {}, GraphTraverser);
	// graphTraverser.createGraphTraverser(graph);
	// return graphTraverser.isBipartite();
	// };
	//
	// /**
	// * Splits the graph into pieces using the cycle.
	// *
	// * @param graph
	// * The graph.
	// * @param cycle
	// * The separating cycle.
	// * @return A set containing the resulting pieces.
	// */
	// this.splitIntoPieces = function(graph, cycle) {
	// var graphTraverser = $.extend(true, {}, GraphTraverser);
	// graphTraverser.createGraphTraverser(graph);
	// return graphTraverser.splitIntoPieces(cycle);
	// // return (new GraphTraverser < T > (graph)).splitIntoPieces(cycle);
	// // return graph.splitIntoPieces(cycle);
	// };
	//
	// /**
	// * Adds two graphs together to produce a new graph with every vertex and
	// * edge contained in the original two.
	// *
	// * @param g1
	// * The first graph.
	// * @param g2
	// * The second graph.
	// * @return g1 + g2, a new graph with all their vertices and edges.
	// */
	// this.addGraphs = function(g1, g2) {
	//
	// var newGraph = $.extend(true, {}, Graph); // new Graph<T>();
	// var nodesList = g1.getVertices();
	// for (v in nodesList) {
	// var neighborsList = g1.getNeighbors(nodesList[v]);
	// for (u in neighborsList) {
	// newGraph.addEdge(nodesList[v], neighborsList[u]);
	// }
	// }
	// nodesList = g2.getVertices();
	// for (v in nodesList) {
	// neighborsList = g2.getNeighbors(nodesList[v]);
	// for (u in neighborsList) {
	// newGraph.addEdge(nodesList[v], neighborsList[u]);
	// }
	// }
	// return newGraph;
	// };
	//
	/**
	 * Subtract one graph from another to produce a new graph with every edge in
	 * the first graph but not the second, and every remaining vertex with
	 * degree > 0.
	 * 
	 * @param g1
	 *            The first graph.
	 * @param g2
	 *            The second graph.
	 * @return g1 - g2.
	 */
	this.subtractGraphs = function(g1, g2) {
		var newGraph = $.extend(true, {}, Graph);
		newGraph.createGraph(g1);
		// Graph<T> newGraph = new Graph<T>( g1 );
		var nodesList = g2.getVertices();
		for (v in nodesList) {
			var neighborList = g2.getNeighbors(nodesList[v]);
			for (u in neighborList) {
				newGraph.removeEdge(nodesList[v], neighborList[u]);
			}
		}
		return newGraph;
	};

}; // Graph

// traversal class
/**
 * A class to perform various operations that involve traversing a graph. This
 * exists to prevent having to pass multiple state variables to recursive calls
 * when performing the traversals. Most operations have a corresponding static
 * method in the Graph class for easier calling.
 * 
 */
var GraphTraverser = new function() {

	/** The graph that this object works on. */
	this.graph;
	//
	/** A set to track nodes already searched in the current traversal. */
	this.searched = [];
	//
	/** A map used for colorings of the graph. */
	/* Map<T, Integer> */this.coloring = {};
	//
	/** A variable to hold the graph resulting from an operation. */
	this.result = [];
	//
	/** A target vertex. */
	this.goal = null;
	//
	/** The next vertex in a traversal (used for walkCycle). */
	this.next = null;
	//
	/** The previous vertex in a traversal (used for walkCycle). */
	this.prev = null;
	//
	/**
	 * Constructor for a GraphTraverser object.
	 * 
	 * @param graph
	 */
	this.createGraphTraverser = function(graph) {
		this.graph = graph;
	};
	//
	/**
	 * Tests whether this graph is bipartite.
	 * 
	 * @return True if it is bipartite.
	 */
	this.isBipartite = function() {
		if (this.graph.numVertices() == 0)
			return true;
		this.coloring = {};
		return this.isBipartite1(
				this.graph.getVertices()[0]/* .iterator().next() */, true);
	};
	//
	/**
	 * Private worker function for isBipartite.
	 * 
	 * @param v
	 *            The current node in the traversal.
	 * @param color
	 *            The color to try for this node.
	 * @return True if no conflicts were found.
	 */
	this.isBipartite1 = function(v, color) {
		if (this.coloring[v]) {
			if (!(this.coloring[v] == (color ? 1 : 0))) {
				return false;
			} else {
				return true;
			}
		} else {
			this.coloring[v] = color ? 1 : 0;
			var bipartite = true;
			var neightborList = this.graph.getNeighbors(v);
			for (n in neightborList) {
				bipartite = bipartite && this.isBipartite1(neightborList[n], !color);
			}
			return bipartite;
		}
	};
	//
	/**
	 * Walks around a cycle, starting from an arbitrary vertex and going in an
	 * arbitrary direction.
	 * 
	 * @return The next vertex in the walk.
	 */
	this.walkCycle = function() {
		if (this.next == null) {
			this.prev = this.graph.getVertices()[0];// .iterator().next();
			this.next = this.graph.getNeighbors(this.prev)[0];// .iterator().next();
		} else {
			var neighborList = this.graph.getNeighbors(this.next);
			for (n in neighborList) {
				if (neighborList[n] != this.prev) {
					this.prev = this.next;
					this.next = neighborList[n];
					break;
				}
			}
		}
		return this.prev;
	};
	//
	/**
	 * Finds a path between two vertices in the graph.
	 * 
	 * @param start
	 *            The starting vertex.
	 * @param end
	 *            The ending vertex.
	 * @param banned
	 *            A collection of sets this path can't pass through.
	 * @return The path between the two vertices.
	 */
	this.findPath = function(start, end, banned) {
		this.searched = []/* .clear() */;
		for (var i = 0; i < banned.length; i++) {
			this.searched.push(banned[i]);
		}
		// searched.addAll( banned );
		this.result = $.extend(true, {}, Graph);
		this.goal = end;
		var pathFound = this.findPath1(start);
		return pathFound ? this.result : null;
	};
	//
	/**
	 * Private worker function for findPath.
	 * 
	 * @param v
	 *            The current node in the path.
	 * @return True if the path was found.
	 */
	this.findPath1 = function(v) {
		this.searched.push(v);
		var neighborList = this.graph.getNeighbors(v);
		for (n in neighborList) {
			var node = neighborList[n];
			if (node == this.goal) {
				this.result.addEdge(v, node);
				return true;
			} else if (!this.searched.includes(node)) {
				this.result.addEdge(v, node);
				var pathFound = this.findPath1(node);
				if (pathFound)
					return true;
				this.result.removeEdge(v, node);
			}
		}
		return false;
	};
	//
	/**
	 * Finds an arbitrary cycle in a biconnected graph.
	 * 
	 * @return A cycle.
	 */
	this.findCycle = function() {
		this.searched = [];
		this.result = $.extend(true, {}, Graph);
		this.goal = this.graph.getVertices()[0];// .iterator().next();
		return this.findCycle1(this.goal);
	};
	//
	/**
	 * Private worker function for findCycle.
	 * 
	 * @param v
	 *            The current node in the cycle.
	 * @return A cycle.
	 */
	this.findCycle1 = function(v) {
		this.searched.push(v);
		var neighborList = this.graph.getNeighbors(v);
		for (n in neighborList) {
			if (neighborList[n] == this.goal && this.result.numVertices() > 2) {
				this.result.addEdge(v, neighborList[n]);
				return this.result;
			} else if (!this.searched.includes(neighborList[n])) {
				this.result.addEdge(v, neighborList[n]);
				var completedCycle = this.findCycle1(neighborList[n]);
				if (completedCycle != null)
					return completedCycle;
				this.result.removeEdge(v, neighborList[n]);
			}
		}
		return null;
	};
	//
	/**
	 * Splits the graph into pieces using the given cycle.
	 * 
	 * @param cycle
	 *            The cycle to split the graph with.
	 * @return A set containing all the pieces of the graph.
	 */
	this.splitIntoPieces = function(cycle) {
		this.searched = [];
		var pieces = [];
		var nodesList = cycle.getVertices();
		for (v in nodesList) {
			this.searched.push(nodesList[v]);
			var neighborsList = this.graph.getNeighbors(nodesList[v]);
			for (n in neighborsList) {
				if (!this.searched.includes(neighborsList[n])
						&& !cycle.hasEdge(neighborsList[n], nodesList[v])) {
					this.result = $.extend(true, {}, Graph);
					this.result.addEdge(nodesList[v], neighborsList[n]);
					this.makePiece(cycle, neighborsList[n]);
					pieces.push(this.result);
				}
			}
		}
		return pieces;
	};
	//
	/**
	 * Private helper function for splitIntoPieces. Creates a piece (connected
	 * without going through the cycle) of the graph from a cycle and a starting
	 * node.
	 * 
	 * @param cycle
	 *            The separating cycle.
	 * @param v
	 *            The current vertex.
	 * 
	 * @return This piece of the graph.
	 */
	this.makePiece = function(cycle, v) {
		if (cycle.hasVertex(v))
			return;
		this.searched.push(v);
		var neighborsList = this.graph.getNeighbors(v);
		for (n in neighborsList) {
			if (!this.result.hasEdge(neighborsList[n], v)) {
				this.result.addEdge(v, neighborsList[n]);
				this.makePiece(cycle, neighborsList[n]);
			}
		}
	};

};// GraphTraverser

// general Functions

/**
 * Tests whether a connected graph is a bipartite.
 * 
 * @param graph
 *            The graph to test.
 * @return Whether it is bipartite or not.
 */
function isBipartite(graph) {
	// return (new GraphTraverser < T > (graph)).isBipartite();
	var graphTraverser = $.extend(true, {}, GraphTraverser);
	graphTraverser.createGraphTraverser(graph);
	return graphTraverser.isBipartite();
};

/**
 * Adds two graphs together to produce a new graph with every vertex and edge
 * contained in the original two.
 * 
 * @param g1
 *            The first graph.
 * @param g2
 *            The second graph.
 * @return g1 + g2, a new graph with all their vertices and edges.
 */
function addGraphs(g1, g2) {

	var newGraph = $.extend(true, {}, Graph); // new Graph<T>();
	var nodesList = g1.getVertices();
	for (v in nodesList) {
		var neighborsList = g1.getNeighbors(nodesList[v]);
		for (u in neighborsList) {
			newGraph.addEdge(nodesList[v], neighborsList[u]);
		}
	}
	// if (g2 != null) {
	nodesList = g2.getVertices();
	for (v in nodesList) {
		neighborsList = g2.getNeighbors(nodesList[v]);
		for (u in neighborsList) {
			newGraph.addEdge(nodesList[v], neighborsList[u]);
		}
	}
	// }
	return newGraph;
};

/**
 * Splits the graph into pieces using the cycle.
 * 
 * @param graph
 *            The graph.
 * @param cycle
 *            The separating cycle.
 * @return A set containing the resulting pieces.
 */
function splitIntoPieces(graph, cycle) {
	var graphTraverser = $.extend(true, {}, GraphTraverser);
	graphTraverser.createGraphTraverser(graph);
	return graphTraverser.splitIntoPieces(cycle);
};

/**
 * Tests whether a connected graph is a path.
 * 
 * @param graph
 *            The graph to test.
 * @return Whether it is a path or not.
 */
function isPath(graph) {
	var start = null;
	var endPoints = 0;
	var nodeLists = graph.getVertices();
	for (v in nodeLists) {
		var degree = graph.getDegree(nodeLists[v]);
		if (degree == 1) {
			endPoints++;
		} else if (degree != 2) {
			return false;
		}
	}
	if (endPoints != 2)
		return false;
	return true;
};
/**
 * Tests the planarity of a BICONNECTED graph. Has to suppress warnings because
 * Java is silly and can't handle arrays of generics properly.
 * 
 * @param graph
 *            The graph to test for planarity.
 * @param cycle
 *            A cycle within the above graph, preferably separating.
 * @return Whether the graph is planar or not.
 */
// return boolean
function testPlanarity(graph, cycle) {
	if (graph.numEdges() > 3 * graph.numVertices() - 6) {
		return false;
	}

	var notInterlacedSet = [ "xbyb", "bybx", "ybxb", "bxby" ];
	var pieces = splitIntoPieces(graph, cycle);
	for (piece in pieces) {
		if (!isPath(pieces[piece])) { // Don't bother if the piece is
			// a path.

			// Need a starting vertex that is an attachment point between the
			// piece and the cycle.
			var start = null;
			var nodesList = cycle.getVertices();
			for (v in nodesList) {
				if (pieces[piece].hasVertex(nodesList[v])) {
					start = nodesList[v];
					break;
				}
			}

			// Construct the part of the new cycle that is coming from the old
			// cycle.
			var cycleSegment = $.extend(true, {}, Graph);/*
															 * new Graph<T>(
															 * cycle );
															 */
			cycleSegment.createGraph(cycle);
			var prev = start;

			// Choose an arbitrary direction to traverse the cycle in.
			var curr = cycle.getNeighbors(prev)[0];// .iterator().next();

			// Remove all the edges between the starting attachment point and
			// the
			// next found attachment point from the cycleSegment graph.
			cycleSegment.removeEdge(prev, curr);
			while (!pieces[piece].hasVertex(curr)) {
				var neighborList = cycle.getNeighbors(curr);
				for (v in neighborList) {
					if (neighborList[v] != prev) {
						prev = curr;
						curr = neighborList[v];
						break;
					}
					;
				}
				cycleSegment.removeEdge(prev, curr);
			}
			var end = curr; // end is the next attachment point found.

			// Find a path through the piece connecting the attachment points,
			// but
			// make sure that it doesn't go through a different attachment
			// point.
			var traverser = $.extend(true, {}, GraphTraverser);
			traverser.createGraphTraverser(pieces[piece]);

			var piecePath = traverser.findPath(start, end, cycle.getVertices());

			// Construct the new graph and the new cycle accordingly.
			var pp = addGraphs(cycle, pieces[piece]);
			var cp = addGraphs(cycleSegment, piecePath);

			// Recurse using them as parameters.
			var planar = testPlanarity(pp, cp);
			if (!planar)
				return false;
		}
	}

	// If all the piece/cycle combinations are planar, then test the
	// interlacement.
	var interlacement = $.extend(true, {}, Graph);
	var pieceArray = pieces;

	// For each pair of pieces, see if they're interlaced.
	for (var i = 0; i < pieceArray.length; i++) {
		var x = pieceArray[i];
		for (var j = i + 1; j < pieceArray.length; j++) {
			var y = pieceArray[j];

			var lastChar = ' '; // Store the last character added to make
			// things easier.
			var symList = ""; // The list of symbols representing the
			// interlacement of the pieces.
			var bCount = 0; // The number of 'b' symbols. Again, to make
			// things easy.

			// Walk around the cycle and construct the symbol list.
			var traverser = $.extend(true, {}, GraphTraverser);
			traverser.createGraphTraverser(cycle);
			// GraphTraverser<T> traverser = new GraphTraverser<T>( cycle );
			for (var k = 0; k < cycle.numVertices(); k++) {
				var v = traverser.walkCycle();
				// If a node is in both pieces, then add a 'b'.
				if (x.hasVertex(v) && y.hasVertex(v)) {
					bCount++;
					symList += 'b';
					lastChar = 'b';
					// Else add if it's only in one piece and it's not the last
					// symbol added.
				} else if (x.hasVertex(v) && lastChar != 'x') {
					symList += 'x';
					lastChar = 'x';
				} else if (y.hasVertex(v) && lastChar != 'y') {
					symList += 'y';
					lastChar = 'y';
				}
			}
			// Check for wrap-around adjacency of x's or y's.
			if ((lastChar == 'x' || lastChar == 'y')
					&& symList.charAt(0) == lastChar) {
				symList = symList.substring(1);
			}
			var interlaced = false;
			if (symList.length > 4 || bCount > 2) {
				interlaced = true;
			} else if (symList.length == 4
					&& !notInterlacedSet.includes(symList)) {
				interlaced = true;
			}
			if (interlaced) {
				interlacement.addEdge(i, j);
			}
		}
	}
	return isBipartite(interlacement);
}
