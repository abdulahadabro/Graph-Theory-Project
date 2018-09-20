var E_Edge = new function() {
	this.From; // head vertex
	this.To; // tail vertex
	this.Weight;// weight of the arc
	this.seen = false;

	/**
	 * Constructor for Edge
	 * 
	 * @param u :
	 *            Vertex - The head of the arc
	 * @param v :
	 *            Vertex - The tail of the arc
	 * @param w :
	 *            int - The weight associated with the arc
	 */
	this.createEulerEdge = function(u, v, w) {
		this.From = u;
		this.To = v;
		this.Weight = w;
		this.seen = false;
	};

	/**
	 * Method to find the other end end of the arc given a vertex reference
	 * 
	 * @param u :
	 *            Vertex
	 * @return The other end of the edge
	 */
	this.otherEnd = function(u) {
		// if the vertex u is the head of the arc, then return the tail else
		// return the head
		if (this.From == u) {
			return this.To;
		} else {
			return this.From;
		}
	};

	/**
	 * Method to represent the edge in the form (x,y) where x is the head of the
	 * arc and y is the tail of the arc
	 */
	this.toString = function() {
		return "(" + this.From + "," + this.To + ")";
	};
};

var E_Vertex = new function() {
	this.name; // name of the vertex
	this.seen; // flag to check if the vertex has already been visited
	this.parent; // parent of the vertex
	this.distance; // distance to the vertex from the source vertex
	/* List<Edge> */this.Adj = []/* , revAdj =[] */; // adjacency list; use
	// LinkedList or ArrayList
	this.degree;

	/**
	 * Constructor for the vertex
	 * 
	 * @param n :
	 *            int - name of the vertex
	 */
	this.createEulerVertex = function(n) {
		this.name = n;
		this.seen = false;
		this.Adj = [];
		this.parent = null;
		this.degree = 0;
	};

	this.getUnvisitedEdge = function() {

		for (var i = 0; i < this.Adj.length; i++) {
			var e = this.Adj[i];
			if (e.seen == false) {
				return e;
			}
		}
		return null;
		// if (this.hasUnvisitedEdge()) {
		// var e = iter.next();
		// while (e.seen && this.hasUnvisitedEdge()) {
		// e = iter.next();
		// }
		// return e.seen ? null : e;
		// } else return null;
	};

	this.hasUnvisitedEdge = function() {
		for (var i = 0; i < this.Adj.length; i++) {
			var e = this.Adj[i];
			if (e.seen == false) {
				return true;
			}
		}
		return false;
	};

	/**
	 * Method to represent a vertex by its name
	 */
	this.toString = function() {
		return this.name;
	};
};

var E_Graph = new function() {
	this.verts = []; // array of vertices
	this.numNodes; // number of vertices in the graph
	this.numEdges;

	/**
	 * Constructor for Graph
	 * 
	 * @param size :
	 *            int - number of vertices
	 */
	this.createEulerGraph = function(size) {
		this.numNodes = size;
		this.numEdges = 0;
		this.verts = [];
		// this.verts.push(0);
		// create an array of Vertex objects
		// for (var i = 1; i <= size; i++) {
		// var vertex = $.extend(true, {}, E_Vertex);
		// vertex.createEulerVertex(i);
		// this.verts.push(vertex);
		// }

	};

	this.addVertix = function(name) {
		var u = $.extend(true, {}, E_Vertex);
		u.createEulerVertex(name);
		this.verts.push(u);
	};

	/**
	 * Method to add an edge to the graph
	 * 
	 * @param a :
	 *            int - one end of edge
	 * @param b :
	 *            int - other end of edge
	 * @param weight :
	 *            int - the weight of the edge
	 */
	this.addEdge = function(a, b, weight) {

		var u = this.getVertixFromList(a);
		if (u == null) {
			u = $.extend(true, {}, E_Vertex);
			u.createEulerVertex(a);
			this.verts.push(u);
		}

		var v = this.getVertixFromList(b);
		if (v == null) {
			v = $.extend(true, {}, E_Vertex);
			v.createEulerVertex(b);
			this.verts.push(v);
		}

		var e = $.extend(true, {}, E_Edge);
		e.createEulerEdge(u, v, weight);
		// Edge e = new Edge(u, v, weight);
		u.Adj.push(e);
		v.Adj.push(e);
		this.numEdges++;
		u.degree++;
		v.degree++;
	};

	this.getVertixFromList = function(a) {
		for (var i = 0; i < this.verts.length; i++) {
			if (this.verts[i].name == a)
				return this.verts[i];
		}
		;
		return null;
	};

	// /**
	// * Method to add an arc (directed edge) to the graph
	// *
	// * @param a :
	// * int - the head of the arc
	// * @param b :
	// * int - the tail of the arc
	// * @param weight :
	// * int - the weight of the arc
	// */
	// void addDirectedEdge(int a, int b, int weight) {
	// Vertex head = verts.get(a);
	// Vertex tail = verts.get(b);
	// Edge e = new Edge(head, tail, weight);
	// head.Adj.add(e);
	// tail.revAdj.add(e);
	// numEdges++;
	// head.degree++;
	// }

	this.initialize = function() {
		for (var i = 0; i < this.verts.length; i++) {
			var u = this.verts[i];
			for (var j = 0; j < u.Adj.length; j++) {
				var e = u.Adj[j];
				e.seen = false;
			}
		}
		// for (Vertex u : this) {
		// for (Edge e : u.Adj)
		// e.seen = false;
		// }
	};

	this.initializeNodes = function() {
		for (var i = 0; i < this.verts.length; i++) {
			var u = this.verts[i];
			u.seen = false;
		}
	};

	// public static Graph readGraph(Scanner in, boolean directed) {
	// // read the graph related parameters
	// int n = in.nextInt(); // number of vertices in the graph
	// int m = in.nextInt(); // number of edges in the graph
	//
	// // create a graph instance
	// Graph g = new Graph(n);
	// for (int i = 0; i < m; i++) {
	// int u = in.nextInt();
	// int v = in.nextInt();
	// int w = in.nextInt();
	// if (directed) {
	// g.addDirectedEdge(u, v, w);
	// } else {
	// g.addEdge(u, v, w);
	// }
	// }
	// in.close();
	//
	//
	// for (Vertex u : g) {
	// u.iter = u.Adj.iterator();
	// }
	// return g;
	// }
};

/**
 * A function which checks the graph for connected and also checks how many odd
 * degree vertices are there. If the graph is not connected or if it has more no
 * of odd degree vertices not equal to 0 or 2 then it just prints 'Graph is not
 * Eulerian' If the no of odd degree vertices are 0 or 2 then it runs the
 * findEuler method and prints the tour.
 * 
 * @param g
 *            The input graph
 */
function printEuler(/* Graph */g, graphId) {

	/**
	 * If the graph is not connected then it is not Eulerian
	 */
	if (!isConnected(g)) {
		console.log("Graph is not Eulerian");
		MAIN_GRAPHS[graphId].isEulerian = false;
		MAIN_GRAPHS[graphId].isEulerPath = false;
		MAIN_GRAPHS[graphId].AllEulerTours = [];
		return;
	}

	/**
	 * As graph is at least connected then we calculate the no of odd degree
	 * vertices
	 */
	var oddVertices = getOddDegVertex(g);

	/**
	 * If the graph has more than two or exactly one odd degree vertex then it
	 * is not Eulerian
	 */
	if (oddVertices.length > 2 || oddVertices.length == 1) {
		console.log("Graph is not Eulerian");
		MAIN_GRAPHS[graphId].isEulerian = false;
		MAIN_GRAPHS[graphId].isEulerPath = false;
		MAIN_GRAPHS[graphId].AllEulerTours = [];
		return;
	}

	var src;
	var eulerPathTour = [];

	/**
	 * If the graph has two odd degree vertices then it has Euler path Setting
	 * src as on of the Odd degree vertices.
	 */
	if (oddVertices.length == 2) {
		var v1 = oddVertices[0];
		var v2 = oddVertices[1];
		src = (v1.degree < v2.degree ? v1 : v2);

		// For One Path only
		// eulerPathTour = findEulerTour(src);
		// prepareToPrint(graphId, src, eulerPathTour, false);

		// For All Paths
		allEulerPathesList = [];
		subPath = [];
		subPath.push(src);
		findEulerPaths(src);
		validateEulerTour(allEulerPathesList,
				MAIN_GRAPHS[graphId].allEdges.length);
		// reverse paths
		reversePaths(allEulerPathesList); // may want to delete it
		MAIN_GRAPHS[graphId].isEulerian = true;
		MAIN_GRAPHS[graphId].isEulerPath = true;
		MAIN_GRAPHS[graphId].AllEulerTours = $.extend(true, [],
				allEulerPathesList);

	}
	/**
	 * The graph has an euler tour. Setting src node as the first vertex
	 */
	else {
		// find a tour that starts from chosen node
		var startNodeName = null;
		src = g.verts[0];
		for (var i = 0; i < MAIN_GRAPHS[graphId].allNodes.length; i++) {
			if (MAIN_GRAPHS[graphId].allNodes[i].id == FROM_NODE_ID) {
				startNodeName = MAIN_GRAPHS[graphId].allNodes[i].name;
				break;
			}
		}
		if (startNodeName != null) {
			for (var i = 0; i < g.verts.length; i++) {
				if (g.verts[i].name == startNodeName) {
					src = g.verts[i];
					break;
				}
			}
		}

		// eulerPathTour = findEulerTour(src);
		// prepareToPrint(graphId, src, eulerPathTour, true);

		// For All cycles
		allEulerPathesList = [];
		subPath = [];
		subPath.push(src);
		findEulerPaths(src);
		// reverse paths
		validateEulerTour(allEulerPathesList,
				MAIN_GRAPHS[graphId].allEdges.length);
		MAIN_GRAPHS[graphId].isEulerian = true;
		MAIN_GRAPHS[graphId].isEulerPath = true;
		MAIN_GRAPHS[graphId].AllEulerTours = $.extend(true, [],
				allEulerPathesList);
	}
}

function reversePaths(allEulerPathesList) {
	var numOfPaths = allEulerPathesList.length;
	for (var i = 0; i < numOfPaths; i++) {
		var array = $.extend(true, [], allEulerPathesList[i]);
		array.reverse();
		allEulerPathesList.push(array);
	}
}
var allEulerPathesList = [];
var subPath = [];
// var subPath = [];
function findEulerPaths(src) {
	// USE DFS
	var isLastNodeInPath = true;
	for (var i = 0; i < src.Adj.length; i++) {
		var e = src.Adj[i];
		if (e.seen == false) {
			e.seen = true;
			var u = e.otherEnd(src);
			subPath.push(u);
			findEulerPaths(u);
			e.seen = false;
			subPath.pop();
			isLastNodeInPath = false;

		}
	}

	// if no more unseen edge from this node
	if (i == src.Adj.length && isLastNodeInPath) {
		// subPath contains the found path
		var pathList = [];
		for (var j = 0; j < subPath.length; j++) {
			pathList.push(subPath[j].name);
		}
		allEulerPathesList.push(pathList);
	}

	return;
}

function prepareToPrint(graphId, src, eulerPathTour, isCircle) {

	MAIN_GRAPHS[graphId].isEulerian = true;
	MAIN_GRAPHS[graphId].isEulerPath = !isCircle;
	MAIN_GRAPHS[graphId].AllEulerTours = [];

	var listOfNodesPath = [];
	listOfNodesPath.push(src);
	var addedNode = src;
	for (var i = 0; i < eulerPathTour.length; i++) {
		var e = eulerPathTour[i];

		var nodeToAdd = e.otherEnd(addedNode);
		listOfNodesPath.push(nodeToAdd);
		addedNode = nodeToAdd;
	}

	MAIN_GRAPHS[graphId].AllEulerTours.push(listOfNodesPath);

	// printing the euler path
	// for (key in listOfNodesPath) {
	// console.log(listOfNodesPath[key].name);
	// }

}

/**
 * Function to check if the graph is connected or not
 * 
 * @param g :
 *            Graph
 * @return True : The graph is connected False : The graph is not connected
 */
function isConnected(/* Graph */g) {
	var src = g.verts[1];
	if (typeof src == "undefined"){
		return false;
	}
	BFS(src);
	// If any vertex is not visited after BFS then the graph is not connected
	for (var i = 0; i < g.verts.length; i++) {
		if (!g.verts[i].seen)
			return false;
	}
	return true;
}

/**
 * Function that performs breadth first search on the given graph
 * 
 * @param src :
 *            Source vertex
 */
function BFS(/* Vertex */src) {
	var/* Queue<Vertex> */queue = [];
	queue.push(src);
	while (queue.length != 0) {
		var u = queue.shift();
		u.seen = true;
		for (e in u.Adj) {
			var neighbour = u.Adj[e].otherEnd(u);
			if (!neighbour.seen)
				queue.push(neighbour);
		}
	}
}

/**
 * Function to find the number of odd degree vertices
 * 
 * @param g :
 *            Graph
 * @return list of vertices that have odd degree
 */
function getOddDegVertex(g) {
	var oddVertex = [];
	for (var i = 0; i < g.verts.length; i++) {
		var u = g.verts[i];
		if (u.degree % 2 != 0)
			oddVertex.push(u);
	}

	return oddVertex;
}

/**
 * Function to find the Euler tour of the given graph The subPath stores the
 * cycle from the particular node. The circuit has the complete tour. We keep on
 * popping from the stack and keep appending the subPath to stack
 * 
 * @param src :
 *            The source node from which euler tour starts
 * @return List of edges which form the tour
 */
function findEulerTour(src) {
	var subPath = [];
	var/* List<Edge> */circuit = [];

	var e = src.getUnvisitedEdge();
	var u = src;
	while (e != null) {
		e.seen = true;
		subPath.unshift(e);
		u = e.otherEnd(u);
		e = u.getUnvisitedEdge();
	}

	while ((subPath.length != 0)) {
		e = subPath.shift();
		circuit.push(e);
		u = e.From;
		var e1 = u.getUnvisitedEdge();
		if (e1 == null) {
			u = e.To;
			e1 = u.getUnvisitedEdge();
		}
		e = e1;
		while (e != null) {
			e.seen = true;
			subPath.unshift(e);
			u = e.otherEnd(u);
			e = u.getUnvisitedEdge();
		}
	}

	// doing reverse so that in euler path case the path will start from src and
	// not the other odd degree vertex
	// It makes it easy to call verify method.
	circuit.reverse();
	return circuit;
}

/**
 * Function to check if the tour/path is valid Euler tour/path It checks the
 * following conditions: 1) All edges are processed only once. 2) No edge is
 * left out 3) It goes from one vertex to other and adjacent edges have a vertex
 * in common.
 * 
 * @param g :
 *            Graph
 * @param tour :
 *            Tour
 * @param start :
 *            Start Vertex
 * @return True : If the path/tour is valid Euler path/tour False : If the
 *         path/tour is not valid Euler path/tour
 */
function verifyTour(g,/* List<Edge> */tour, /* Vertex */start) {

	if (tour.length != g.numEdges)
		return false;
	g.initialize();
	var count = 0;
	for (e in tour) {

		if ((tour[e].From.name != start.name && tour[e].To.name != start.name)
				|| tour[e].seen) {
			break;
		}
		count++;
		start = tour[e].otherEnd(start);
		tour[e].seen = true;
	}
	return count == g.numEdges;
}

function validateEulerTour(allEulerPathesList, numEdges) {

	for (var i = 0; i < allEulerPathesList.length; i++) {
		var tour = allEulerPathesList[i];
		if (tour.length != numEdges + 1) {
			allEulerPathesList.splice(i--, 1);
		}
	}
}

/**
 * A driver method which reads the graph from console or from the file passed as
 * cmd args
 * 
 * @param args
 *            Pass filename at args[0] or do not enter to enter input from
 *            console.
 */
function TestForEuler(graphId) {

	// read the graph related parameters
	var n = MAIN_GRAPHS[graphId].allNodes.length; // number of vertices in the
	// graph
	var m = MAIN_GRAPHS[graphId].allEdges.length; // number of edges in the
	// graph

	// create a graph instance
	var g = $.extend(true, {}, E_Graph);
	g.createEulerGraph(n);
	for (var i = 0; i < MAIN_GRAPHS[graphId].allNodes.length; i++) {
		g.addVertix(MAIN_GRAPHS[graphId].allNodes[i].name);
	}

	// Graph g = new Graph(n);
	for (var i = 0; i < m; i++) {
		var uId = MAIN_GRAPHS[graphId].allEdges[i].source;
		var u = getNodeOfId(graphId, uId).name;
		var vId = MAIN_GRAPHS[graphId].allEdges[i].target;
		var v = getNodeOfId(graphId, vId).name;
		var w = MAIN_GRAPHS[graphId].allEdges[i].weight;
		g.addEdge(u, v, w);
	}

	// for (var i = 0; i < g.verts.length; i++) {
	// var node = g.verts[i];
	// }
	printEuler(g, graphId);
};

function TestForHamilton(graphId) {

	// read the graph related parameters
	var n = MAIN_GRAPHS[graphId].allNodes.length; // number of vertices in the
	// graph
	var m = MAIN_GRAPHS[graphId].allEdges.length; // number of edges in the
	// graph

	// create a graph instance
	var g = $.extend(true, {}, E_Graph);
	g.createEulerGraph(n);
	for (var i = 0; i < MAIN_GRAPHS[graphId].allNodes.length; i++) {
		g.addVertix(MAIN_GRAPHS[graphId].allNodes[i].name);
	}

	// Graph g = new Graph(n);
	for (var i = 0; i < m; i++) {
		var uId = MAIN_GRAPHS[graphId].allEdges[i].source;
		var u = getNodeOfId(graphId, uId).name;
		var vId = MAIN_GRAPHS[graphId].allEdges[i].target;
		var v = getNodeOfId(graphId, vId).name;
		var w = MAIN_GRAPHS[graphId].allEdges[i].weight;
		g.addEdge(u, v, w);
	}

	// for (var i = 0; i < g.verts.length; i++) {
	// var node = g.verts[i];
	// }
	findHamilton(g, graphId);
};
var allHamiltonPathesList = [];
var allHamiltonCyclesList = [];
function findHamilton(g, graphId) {

	/**
	 * If the graph is not connected then it is not Hamiltonian
	 */
	if (!isConnected(g)) {
		console.log("Graph is not Hamiltonian");
		MAIN_GRAPHS[graphId].isHamiltonian = false;
		MAIN_GRAPHS[graphId].AllHamiltonPaths = [];
		MAIN_GRAPHS[graphId].AllHamiltonTours = [];
		return;
	}

	var src;
	// Test All nodes as first node
	for (var j = 0; j < g.verts.length; j++) {

		g.initializeNodes();
		src = g.verts[j];
		// For All cycles
		allHamiltonPathesList = [];
		allHamiltonCyclesList = [];
		subPath = [];
		// subPath.push(src);
		findHamiltonPathsCycles(src, g.verts.length);
		// reverse paths
		// validateEulerTour(allEulerPathesList,
		// MAIN_GRAPHS[graphId].allEdges.length);
		MAIN_GRAPHS[graphId].AllHamiltonPaths = MAIN_GRAPHS[graphId].AllHamiltonPaths
				.concat(allHamiltonPathesList);
		// MAIN_GRAPHS[graphId].AllHamiltonPaths = $.extend(true, [],
		// allHamiltonPathesList);
		MAIN_GRAPHS[graphId].AllHamiltonTours = MAIN_GRAPHS[graphId].AllHamiltonTours
				.concat(allHamiltonCyclesList);
		// MAIN_GRAPHS[graphId].AllHamiltonTours = $.extend(true, [],
		// allHamiltonCyclesList);
	}

	if (MAIN_GRAPHS[graphId].AllHamiltonPaths.length > 0
			|| MAIN_GRAPHS[graphId].AllHamiltonTours.length > 0) {
		MAIN_GRAPHS[graphId].isHamiltonian = true;
	} else
		MAIN_GRAPHS[graphId].isHamiltonian = false;

}

function findHamiltonPathsCycles(src, numOfNodes) {
	// USE DFS
	subPath.push(src);
	src.seen = true;
	var isLastNodeInPath = true;
	for (var i = 0; i < src.Adj.length; i++) {
		var e = src.Adj[i];
		var u = e.otherEnd(src);
		if (u.seen == false) {
			// e.seen = true;

			// subPath.push(u);
			findHamiltonPathsCycles(u, numOfNodes);

			u.seen = false;
			subPath.pop();
			isLastNodeInPath = false;

		}
	}

	// if no more unseen edge from this node
	if (isLastNodeInPath) {

		if (subPath.length == numOfNodes) {
			// path found
			// subPath contains the found path
			var pathList = [];
			for (var j = 0; j < subPath.length; j++) {
				pathList.push(subPath[j].name);
			}
			allHamiltonPathesList.push(pathList);
			// check if this path can be cycle
			for (var k = 0; k < src.Adj.length; k++) {
				var e = src.Adj[k];
				var u = e.otherEnd(src);
				if (u == subPath[0] ){
					// cycle found
					var cycleList =$.extend(true,[],pathList);
					cycleList.push(subPath[0].name);
					allHamiltonCyclesList.push(cycleList);
					break;
				}
			}
			
		}

	}

	return;
}