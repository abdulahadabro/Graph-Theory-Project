function checkifIzomorphism(graphId, otherGraphId) {

	var toReturn = {
		isIzo : false,
		invariants : [],
	};
	// we check the invariants
	// num of nodes
	// num of edges
	// degree of nodes
	// cycles lengths
	var nodes1 = MAIN_GRAPHS[graphId].allNodes;
	var edges1 = MAIN_GRAPHS[graphId].allEdges;

	var nodes2 = MAIN_GRAPHS[otherGraphId].allNodes;
	var edges2 = MAIN_GRAPHS[otherGraphId].allEdges;
	// Nodes check
	if (nodes1.length != nodes2.length) {
		// not izomorphisim
		toReturn.isIzo = false;
		toReturn.invariants.push("Number of vertices is not equal");
		return toReturn;
	}
	// Edges check
	if (edges1.length != edges2.length) {
		// not izomorphisim
		toReturn.isIzo = false;
		toReturn.invariants.push("Number of edges is not equal");
		return toReturn;
	}

	// nodes degrees check
	findAllDegrees(graphId);
	findAllDegrees(otherGraphId);
	var degreesSet1 = MAIN_GRAPHS[graphId].nodesDegrees;
	var degreesSet2 = MAIN_GRAPHS[otherGraphId].nodesDegrees;
	var set1Length = 0;
	var set2Length = 0;
	for (key in degreesSet1) {
		set1Length++;
	}
	for (key in degreesSet2) {
		set2Length++;
	}
	if (set1Length != set2Length) {
		// not izomorphisim
		toReturn.isIzo = false;
		toReturn.invariants.push("Nodes degrees are different");
		return toReturn;
	}
	for (key in degreesSet1) {
		if (degreesSet1[key] != degreesSet2[key]) {
			// not izomorphisim
			toReturn.isIzo = false;
			toReturn.invariants.push("Nodes degrees are different");
			return toReturn;
		}
	}

	// cycles length check
	findAllCyclesWithAllLengths(graphId);
	findAllCyclesWithAllLengths(otherGraphId);
	var cyclesSet1 = MAIN_GRAPHS[graphId].allCycles;
	var cyclesSet2 = MAIN_GRAPHS[otherGraphId].allCycles;
	set1Length = 0;
	set2Length = 0;
	for (key in cyclesSet1) {
		set1Length++;
	}
	for (key in cyclesSet2) {
		set2Length++;
	}
	if (set1Length != set2Length) {
		// not izomorphisim
		toReturn.isIzo = false;
		toReturn.invariants.push("Cycles Lengths are different");
		return toReturn;
	}
	for (key in cyclesSet1) {
		if (cyclesSet1[key].length != cyclesSet2[key].length) {
			// not izomorphisim
			toReturn.isIzo = false;
			toReturn.invariants.push("Cycles Lengths are different");
			return toReturn;
		}
	}

	// all variants true ... graphs could be izomorphisim
	toReturn.isIzo = true;
	toReturn.invariants.push("They could be izomorphism");
	return toReturn;
}

function findShortPath(graphId, fromNodeId, toNodeId) {

	var nodes = [];
	var edges = [];

	var u = null, v = null;

	for (var i = 0; i < MAIN_GRAPHS[graphId].allNodes.length; i++) {
		var vtx = $.extend(true, {}, DiVertex);
		var node = MAIN_GRAPHS[graphId].allNodes[i];
		vtx.createDiVertex(node.id, node.name);
		nodes.push(vtx);
		// from to nodes indexes
		if (node.id == fromNodeId)
			u = i;
		if (node.id == toNodeId)
			v = i;
	}

	for (var i = 0; i < MAIN_GRAPHS[graphId].allEdges.length; i++) {
		var eg = $.extend(true, {}, DiEdge);
		var edge = MAIN_GRAPHS[graphId].allEdges[i];
		// nodes without weight are considered zero weights
		var weight = edge.weight == null ? 0 : edge.weight;
		eg.createDiEdge("Edge_" + i, nodes[edge.sourceIndex],
				nodes[edge.targetIndex], parseFloat(weight));
		edges.push(eg);
	}

	// Lets check from location Loc_1 to Loc_10
	var diGraph = $.extend(true, {}, DiGraph);
	diGraph.createDiGraph(nodes, edges);
	var dijkstra = $.extend(true, {}, DijkstraAlgorithm);
	dijkstra.createDijkstraAlgorithm(diGraph);

	dijkstra.execute(nodes[u]);
	var path = dijkstra.getPath(nodes[v]);
	MAIN_GRAPHS[graphId].shortestPath = null;
	MAIN_GRAPHS[graphId].shortestPathCost = null;
	if (path.path == null) {
		console.log("No Path exists");
	} else {
		MAIN_GRAPHS[graphId].shortestPath = [];
		MAIN_GRAPHS[graphId].shortestPathCost = path.distance;
		for (key in path.path) {
			MAIN_GRAPHS[graphId].shortestPath.push(path.path[key].name);
		}
	}
}

function colorGraphWithBacktraking(graphId) {

	var n = MAIN_GRAPHS[graphId].allNodes.length;
	var matrix = MAIN_GRAPHS[graphId].graphMatrix.matrix;
	var colors = [];
	var zeroLine = [];
	for (var i = 0; i < matrix.length + 1; i++) {
		colors.push(0);
		zeroLine.push(0);
	}
	zeroLine.pop();
	matrix.unshift(zeroLine);
	for (var i = 0; i < matrix.length; i++) {
		matrix[i].unshift(0);
	}
	MAIN_GRAPHS[graphId].graphColors = null;
	// Start coloring process with 1 color and increment if not good enough
	for (var m = 1; m <= n; m++) {
		var mWayGrColor = $.extend(true, {}, BackTrackGraphColorer);
		mWayGrColor.createGrColor(n, m, matrix, colors, graphId);
		mWayGrColor.mColoring(1);
		if (mWayGrColor.soln != 0) {
			// solution found
			// prepare colors
			var colors = [];
			for (var i = 1; i <= mWayGrColor.n; i++) {
				colors.push(mWayGrColor.x[i] - 1);
			}
			reColorNodes(graphId, colors);
			MAIN_GRAPHS[graphId].graphMinNumOfColors = m;
			MAIN_GRAPHS[graphId].graphColors = colors;
			break;
		}
		// console.log("\nNeed more than " + mWayGrColor.m + " colors");
	}

}

var BackTrackGraphColorer = new function() {
	this.G; // matrix
	this.x; // colors
	this.n; // num of nodes
	this.m; // num of colors
	this.soln = 0; // solution

	this.createGrColor = function(n, m, matrix, x) {
		this.n = n;
		this.G = matrix;
		this.x = x;
		this.m = m;
	};

	this.mColoring = function(k) { // backtracking function
		for (var i = 1; i <= this.n; i++) {
			this.next_color(k); // coloring kth vertex
			if (this.x[k] == 0)
				return 0; // if unsuccessful then backtrack
			if (k == this.n) { // if all colored then show
				// this.write();
				this.soln++;
				return 1;
			} else {
				// successful but still left to color
				var flag = this.mColoring(k + 1);
				if (flag == 1) {
					return 1;
				}
			}
		}
	};

	this.next_color = function(k) {
		do {
			var i = 1;
			this.x[k] = (this.x[k] + 1) % (this.m + 1);
			if (this.x[k] == 0)
				return;
			// checking adjacency and not same color
			for (i = 1; i <= this.n; i++) {
				// do not check loops
				if (i == k)
					continue;
				if (this.G[i][k] != 0 && this.x[k] == this.x[i])
					break;
			}

			if (i == this.n + 1)
				return; // new color found
		} while (true);
	};
};

/**
 * Function to check if a graph is connected or not
 * 
 * @param graphId
 * @returns boolean
 */
function isGraphConnected(graphId) {

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

	if (n > 1 && m == 0) {
		MAIN_GRAPHS[graphId].isConnected = false;
	} else if (n == 1 && m == 0) {
		MAIN_GRAPHS[graphId].isConnected = true;
	} else {
		MAIN_GRAPHS[graphId].isConnected = isConnected(g);
	}

	return MAIN_GRAPHS[graphId].isConnected;

}

function findAllDegrees(graphId) {

	// read the graph related parameters
	var n = MAIN_GRAPHS[graphId].allNodes.length; // number of vertices in the
	// graph
	var m = MAIN_GRAPHS[graphId].allEdges.length; // number of edges in the
	// graph

	// create a graph instance
	var g = $.extend(true, {}, E_Graph);
	g.createEulerGraph(n);
	// Graph g = new Graph(n);
	for (var i = 0; i < m; i++) {
		var uId = MAIN_GRAPHS[graphId].allEdges[i].source;
		var u = getNodeOfId(graphId, uId).name;
		var vId = MAIN_GRAPHS[graphId].allEdges[i].target;
		var v = getNodeOfId(graphId, vId).name;
		var w = MAIN_GRAPHS[graphId].allEdges[i].weight;
		g.addEdge(u, v, w);
	}

	MAIN_GRAPHS[graphId].nodesDegrees = {};
	for (var i = 0; i < g.verts.length; i++) {
		var nodeDegree = g.verts[i].degree;
		if (!MAIN_GRAPHS[graphId].nodesDegrees[nodeDegree]) {
			MAIN_GRAPHS[graphId].nodesDegrees[nodeDegree] = 1;
		} else {
			MAIN_GRAPHS[graphId].nodesDegrees[nodeDegree]++;
		}
	}
	// include zero degree nodes
	if (g.verts.length < n) {
		MAIN_GRAPHS[graphId].nodesDegrees[0] = (n - g.verts.length);
	}

};

function findAllCyclesWithAllLengths(graphId) {
	var nodes = MAIN_GRAPHS[graphId].allNodes;
	var matrix = MAIN_GRAPHS[graphId].graphMatrix.matrix;
	var nodeNames = [];
	for (var i = 0; i < nodes.length; i++) {
		nodeNames.push(nodes[i].name);
	}

	var ecs = $.extend(true, {}, ElementaryCyclesSearch);
	ecs.createElementaryCyclesSearch(matrix, nodeNames);
	// ElementaryCyclesSearch ecs = new ElementaryCyclesSearch(adjMatrix,
	// nodes);
	var cycles = ecs.getElementaryCycles();

	MAIN_GRAPHS[graphId].allCycles = {};
	for (var i = 0; i < cycles.length; i++) {
		var cycle = cycles[i];
		cycle.push(cycle[0]);
		if (cycle.length > 3) {
			if (!isCycleExist(cycle, MAIN_GRAPHS[graphId].allCycles)) {
				var length = cycle.length - 1;
				if (!MAIN_GRAPHS[graphId].allCycles[length]) {
					MAIN_GRAPHS[graphId].allCycles[length] = [];
				}
				MAIN_GRAPHS[graphId].allCycles[length].push(cycle);
			}
			// var string = "";
			// for (var j = 0; j < cycle.length; j++) {
			// var node = cycle[j];
			// if (j < cycle.length - 1) {
			// string += (node + " -> ");
			// // console.log(node + " -> ");
			// } else {
			// string += (node);
			// // console.log(node);
			// }
			// }
			// console.log(string);
			// System.out.print("\n");
		}
	}

}

var pathsList = [];
var paths = [];
function findAllPathesWithAllLengths(graphId, fromNodeId, toNodeId) {

	/* Let us create the graph shown in above diagram */

	var nodes = MAIN_GRAPHS[graphId].allNodes;
	var size = nodes.length;
	var matrix = MAIN_GRAPHS[graphId].graphMatrix.matrix;
	var u = null, v = null;
	for (var i = 0; i < nodes.length; i++) {
		if (nodes[i].id == fromNodeId) {
			u = i;
			if (v != null)
				break;
		}
		if (nodes[i].id == toNodeId) {
			v = i;
			if (u != null)
				break;
		}
	}
	// KPaths
	// p = new KPaths();
	MAIN_GRAPHS[graphId].allPathes = {};
	for (var i = 1; i <= size; i++) {
		var k = i;
		pathsList = [];
		paths = [];
		countALLPathes(nodes, matrix, u, v, k, size);
		MAIN_GRAPHS[graphId].allPathes[k] = $.extend(true, [], pathsList);

	}

}
function countALLPathes(nodes, matrix, u, v, k, size) {
	paths.push(nodes[u].name);
	// Base cases
	if (k == 0) {
		if (nodes[u].name == nodes[v].name) {
			// path found
			// copy path to list of pathes
			pathsList.push(paths.toString());
			return;
		} else {
			return;
		}
	}
	// Go to all adjacents of u and recur
	for (var i = 0; i < size; i++) {
		if (matrix[u][i] == 1) {
			// Check if is adjacent of u
			countALLPathes(nodes, matrix, i, v, k - 1, size);
			paths.pop();
		}
	}
	return;
}

/**
 * function to check if graph is planner or not
 * 
 * @param graphId
 */
function isGraphPlanner(graphId) {

	var graph = $.extend(true, {}, Graph);
	graph.createGraphFromEdges(MAIN_GRAPHS[graphId].allEdges);
	var graphTraverser = $.extend(true, {}, GraphTraverser);
	graphTraverser.createGraphTraverser(graph);

	var cycle = graphTraverser.findCycle();
	if (cycle == null) {
		// graph has no cycles at all
		MAIN_GRAPHS[graphId].isPlanner = true;
		console.log("Ayham :: planar");
	} else {
		// test planner
		if (testPlanarity(graph, cycle)) {
			MAIN_GRAPHS[graphId].isPlanner = true;
			console.log("Ayham :: planar");
		} else {
			MAIN_GRAPHS[graphId].isPlanner = false;
			console.log("Ayham :: nonplanar");
		}
	}

}

// This function returns true if graph is Bipartite, else false
/**
 * function to check if a graph is bipartite or not
 * 
 * @param graphId
 * @param opt
 * @returns {Boolean}
 */
function isGraphBipartitle(graphId, opt) {
	var isColorNodes = false;
	if (opt && opt.isColorNodes) {
		isColorNodes = opt.isColorNodes;
	}
	// Create a color array to store colors assigned to all veritces.
	// Vertex number is used as index in this array. The value '-1'
	// of colorArr[i] is used to indicate that no color is assigned
	// to vertex 'i'. The value 1 is used to indicate first color
	// is assigned and value 0 indicates second color is assigned.
	var V = MAIN_GRAPHS[graphId].allNodes.length;
	var G = MAIN_GRAPHS[graphId].graphMatrix.matrix;
	var colorArr = [];
	var nodesList = MAIN_GRAPHS[graphId].allNodes;
	for (var i = 0; i < nodesList.length; i++) {
		colorArr.push(-1);
	}

	var src = 0;
	// Assign first color to source
	colorArr[src] = 1;

	// Create a queue (FIFO) of vertex numbers and enqueue
	var q = [];
	// source vertex for BFS traversal

	q.push(src);

	// Run while there are vertices in queue (Similar to BFS)
	while (q.length != 0) {

		// Dequeue a vertex from queue
		var u = q.shift();

		// Find all non-colored adjacent vertices
		for (var v = 0; v < V; ++v) {
			// An edge from u to v exists and destination v is
			// not colored
			if (G[u][v] == 1 && colorArr[v] == -1) {
				// Assign alternate color to this adjacent v of u
				colorArr[v] = 1 - colorArr[u];
				q.push(v);
			}

			// An edge from u to v exists and destination v is
			// colored with same color as u
			else if (G[u][v] == 1 && colorArr[v] == colorArr[u]) {
				MAIN_GRAPHS[graphId].isBipartite = false;
				// if required re-color nodes
				// if (isColorNodes) {
				reColorNodes(graphId);
				// }
				return false;
			}

		}
	}
	// If we reach here, then all adjacent vertices can
	// be colored with alternate color
	// // check if there is disconnected node , and color it with one of the
	// colors
	// for (var u = 0; u < V; u++) {
	// var isConnected = false;
	// for (var v = 0; v < V; ++v) {
	// // check if an edge is not connected to any other edge
	// if (G[u][v] == 1) {
	// isConnected = true;
	// break;
	// }
	// }
	// if (isConnected == false) {
	// // give it first color
	// colorArr[u] = 0;
	// }
	// }
	// Good to go
	MAIN_GRAPHS[graphId].isBipartite = true;
	// if required re-color nodes
	if (isColorNodes) {
		reColorNodes(graphId, colorArr);
	} else {
		reColorNodes(graphId);
	}
	return true;
}

function isCycleExist(cycle, allCycles) {
	var cycleLength = cycle.length - 1;
	for (c in allCycles) {
		var cyclesList = allCycles[c];
		if (c == cycleLength) {
			// compare cyclesList with cycle
			for (var j = 0; j < cyclesList.length; j++) {
				if (isSameCycle(cyclesList[j], cycle))
					return true;
			}
		}
	}
	return false;
}

function isSameCycle(cycle1, cycle2) {

	if (cycle1.length != cycle2.length)
		return false;
	for (var i = 0; i < cycle1.length; i++) {
		if (!cycle2.includes(cycle1[i]))
			return false;
	}
	return true;
}
