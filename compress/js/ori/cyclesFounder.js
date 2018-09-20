var AdjacencyList = new function() {
	this.getAdjacencyList = function(adjacencyMatrix) {
		var list = {};
		for (var i = 0; i < adjacencyMatrix.length; i++) {
			var v = [];
			for (var j = 0; j < adjacencyMatrix[i].length; j++) {
				if (adjacencyMatrix[i][j] == 1) {
					v.push(j);
				}
			}
			list[i] = [];
			for (var j = 0; j < v.length; j++) {
				list[i].push(v[j]);
			}
		}
		return list;
	};
};

var ElementaryCyclesSearch = new function() {
	/** List of cycles */
	this.cycles = null;

	/** Adjacency-list of graph */
	this.adjList = null;

	/** Graphnodes */
	this.graphNodes = null;

	/** Blocked nodes, used by the algorithm of Johnson */
	this.blocked = null;

	/** B-Lists, used by the algorithm of Johnson */
	this.B = null;

	/** Stack for nodes, used by the algorithm of Johnson */
	this.stack = null;
	
	this.sizee =0;

	/**
	 * Constructor.
	 * 
	 * @param matrix
	 *            adjacency-matrix of the graph
	 * @param graphNodes
	 *            array of the graphnodes of the graph; this is used to build
	 *            sets of the elementary cycles containing the objects of the
	 *            original graph-representation
	 */
	this.createElementaryCyclesSearch = function(matrix, graphNodes) {
		this.graphNodes = graphNodes;
		var adjacencyList = $.extend(true, {}, AdjacencyList);
		this.adjList = adjacencyList.getAdjacencyList(matrix);
		
		this.sizee = 0;
		for( key in this.adjList){
			this.sizee++;
		}
	};

	/**
	 * Returns List::List::Object with the Lists of nodes of all elementary
	 * cycles in the graph.
	 * 
	 * @return List::List::Object with the Lists of the elementary cycles.
	 */
	this.getElementaryCycles = function() {
		this.cycles = [];
		this.blocked = [];
		this.B = zeroMatrix([ this.sizee, 0 ]);
		for( key in this.adjList){
			this.blocked.push(false);
//			this.B.push(0);
		}
//		for (var i = 0; i < this.adjList.length; i++) {
//			this.blocked.push(false);
//			this.B.push(0);
//		}

		this.stack = [];
		var sccs = $.extend(true, {}, StrongConnectedComponents);
		sccs.createStrongConnectedComponents(this.adjList);
		
		var s = 0;

		while (true) {

			var sccResult = sccs.getAdjacencyList(s);
			if (sccResult != null && sccResult.getAdjList() != null) {
				var scc = sccResult.getAdjList();
				s = sccResult.getLowestNodeId();
				for (var j = 0; j < scc.length; j++) {
					if ((scc[j] != null) && (scc[j].length > 0)) {
						this.blocked[j] = false;
						this.B[j] = [];
					}
				}

				this.findCycles(s, s, scc);
				s++;
			} else {
				break;
			}
		}

		return this.cycles;
	};

	/**
	 * Calculates the cycles containing a given node in a strongly connected
	 * component. The method calls itself recursivly.
	 * 
	 * @param v
	 * @param s
	 * @param adjList
	 *            adjacency-list with the subgraph of the strongly connected
	 *            component s is part of.
	 * @return true, if cycle found; false otherwise
	 */
	this.findCycles = function(v, s, adjList) {
		var f = false;
		this.stack.push(v);
		this.blocked[v] = true;

		for (var i = 0; i < adjList[v].length; i++) {
			var neighborsList = adjList[v];
			var w = neighborsList[i];/* .intValue() */
			;
			// found cycle
			if (w == s) {
				var cycle = [];
				for (var j = 0; j < this.stack.length; j++) {
					var index = (this.stack[j])/* .intValue() */;
					cycle.push(this.graphNodes[index]);
				}
				this.cycles.push(cycle);
				f = true;
			} else if (!this.blocked[w]) {
				if (this.findCycles(w, s, adjList)) {
					f = true;
				}
			}
		}

		if (f) {
			this.unblock(v);
		} else {
			for (var i = 0; i < adjList[v].length; i++) {
				var w = adjList[v][i];
				if (!this.B[w].includes(v)) {
					this.B[w].push(v);
				}
			}
		}

		// this.stack.remove(v);
		for (var k = 0; k < this.stack.length; k++) {
			if (this.stack[k] == v) {
				this.stack.splice(k, 1);
				// this.stack.remove(v);
				break;
			}
		}

		return f;
	};
	//
	/**
	 * Unblocks recursivly all blocked nodes, starting with a given node.
	 * 
	 * @param node
	 *            node to unblock
	 */
	this.unblock = function(node) {
		this.blocked[node] = false;
		var Bnode = this.B[node];
		while (Bnode.length > 0) {
			var w = Bnode[0];
			// Bnode.remove(0);
			Bnode.splice(0, 1);
			if (this.blocked[w]) {
				this.unblock(w);
			}
		}
	};
};

var SCCResult = new function() {
	this.nodeIDsOfSCC = null;// Set
	this.adjList = null;
	this.lowestNodeId = -1;

	this.createSCCResult = function(adjList, lowestNodeId) {
		this.adjList = adjList;
		this.lowestNodeId = lowestNodeId;
		this.nodeIDsOfSCC = [];
		if (this.adjList != null) {
			var sizee = 0;
			for (key in this.adjList){
				sizee++;
			}
			for (var i = this.lowestNodeId; i < sizee; i++) {
				if (this.adjList[i].length > 0) {
					// TODO : check if not includes
					this.nodeIDsOfSCC.push(i);
				}
			}
		}
	};

	this.getAdjList = function() {
		return this.adjList;
	};

	this.getLowestNodeId = function() {
		return this.lowestNodeId;
	};
};

var StrongConnectedComponents = new function() {
	/** Adjacency-list of original graph */
	this.adjListOriginal = null;

	/** Adjacency-list of currently viewed subgraph */
	this.adjList = null;

	/** Helpattribute for finding scc's */
	this.visited = null;

	/** Helpattribute for finding scc's */
	this.stack = null;

	/** Helpattribute for finding scc's */
	this.lowlink = null;

	/** Helpattribute for finding scc's */
	this.number = null;

	/** Helpattribute for finding scc's */
	this.sccCounter = 0;

	/** Helpattribute for finding scc's */
	this.currentSCCs = null;
	// size of adj list
	this.sizee = 0;


	/**
	 * Constructor.
	 * 
	 * @param adjList
	 *            adjacency-list of the graph
	 */
	this.createStrongConnectedComponents = function(adjList) {
		this.adjListOriginal = adjList;
		this.sizee = 0;
		for (key in this.adjListOriginal){
			this.sizee++;
		}
	};
	//
	/**
	 * This method returns the adjacency-structure of the strong connected
	 * component with the least vertex in a subgraph of the original graph
	 * induced by the nodes {s, s + 1, ..., n}, where s is a given node. Note
	 * that trivial strong connected components with just one node will not be
	 * returned.
	 * 
	 * @param node
	 *            node s
	 * @return SCCResult with adjacency-structure of the strong connected
	 *         component; null, if no such component exists
	 */
	this.getAdjacencyList = function(node) {
		this.visited = [];
		this.lowlink = [];
		this.number = [];
	

		for (var i = 0; i < this.sizee; i++) {
			this.visited.push(false);
			this.lowlink.push(0);
			this.number.push(0);

		}
		this.stack = [];
		this.currentSCCs = [];

		this.makeAdjListSubgraph(node);

		for (var i = node; i < this.sizee/*this.adjListOriginal.length*/; i++) {
			if (!this.visited[i]) {
				this.getStrongConnectedComponents(i);
				var nodes = this.getLowestIdComponent();
				if (nodes != null && !nodes.includes(node)
						&& !nodes.includes(node + 1)) {
					return this.getAdjacencyList(node + 1);
				} else {
					var adjacencyList = this.getAdjList(nodes);
					if (adjacencyList != null) {
						for (var j = 0; j < this.sizee/*this.adjListOriginal.length*/; j++) {
							if (adjacencyList[j].length > 0) {
								var sCCResult = $.extend(true, {}, SCCResult);
								sCCResult.createSCCResult(adjacencyList, j);
								return sCCResult;/*
													 * new
													 * SCCResult(adjacencyList,
													 * j);
													 */
							}
						}
					}
				}
			}
		}

		return null;
	};
	//
	/**
	 * Builds the adjacency-list for a subgraph containing just nodes >= a given
	 * index.
	 * 
	 * @param node
	 *            Node with lowest index in the subgraph
	 */
	this.makeAdjListSubgraph = function(node) {

		this.adjList = zeroMatrix([ this.sizee, 0 ]);// new
		// int[this.adjListOriginal.length][0];

		for (var i = node; i < this.adjList.length; i++) {
			var successors = [];
			for (var j = 0; j < this.adjListOriginal[i].length; j++) {
				if (this.adjListOriginal[i][j] >= node) {
					successors.push(this.adjListOriginal[i][j]);
				}
			}
			if (successors.length > 0) {
				this.adjList[i] = [];// new int[successors.size()];
				for (var k = 0; k < successors.length; k++) {
					this.adjList[i].push(0);
				}
				for (var j = 0; j < successors.length; j++) {
					var succ = successors[j];
					this.adjList[i][j] = succ;
				}
			}
		}
	};
	//
	/**
	 * Calculates the strong connected component out of a set of scc's, that
	 * contains the node with the lowest index.
	 * 
	 * @return Vector::Integer of the scc containing the lowest nodenumber
	 */
	this.getLowestIdComponent = function() {
		var min = this.adjList.length;
		var currScc = null;

		for (var i = 0; i < this.currentSCCs.length; i++) {
			var scc = this.currentSCCs[i];
			for (var j = 0; j < scc.length; j++) {
				var node = scc[j];
				if (node < min) {
					currScc = scc;
					min = node;
				}
			}
		}

		return currScc;
	};
	//
	/**
	 * @return Vector[]::Integer representing the adjacency-structure of the
	 *         strong connected component with least vertex in the currently
	 *         viewed subgraph
	 */
	this.getAdjList = function(nodes) {
		var lowestIdAdjacencyList = null;

		if (nodes != null) {
			lowestIdAdjacencyList = {};// new Vector[this.adjList.length];
			for (var k = 0; k < this.adjList.length; k++) {
				lowestIdAdjacencyList[k] = [];
			}
			// for (var i = 0; i < this.adjList/*lowestIdAdjacencyList*/.length;
			// i++) {
			// lowestIdAdjacencyList[i] = new Vector();
			// }
			for (var i = 0; i < nodes.length; i++) {
				var node = nodes[i];
				for (var j = 0; j < this.adjList[node].length; j++) {
					var succ = this.adjList[node][j];
					if (nodes.includes(succ)) {
						lowestIdAdjacencyList[node].push(succ);
					}
				}
			}
		}

		return lowestIdAdjacencyList;
	};
	//
	/**
	 * Searchs for strong connected components reachable from a given node.
	 * 
	 * @param root
	 *            node to start from.
	 */
	this.getStrongConnectedComponents = function(root) {
		this.sccCounter++;
		this.lowlink[root] = this.sccCounter;
		this.number[root] = this.sccCounter;
		this.visited[root] = true;
		this.stack.push(root);

		for (var i = 0; i < this.adjList[root].length; i++) {
			var w = this.adjList[root][i];
			if (!this.visited[w]) {
				this.getStrongConnectedComponents(w);
				this.lowlink[root] = Math.min(this.lowlink[root], this.lowlink[w]);
			} else if (this.number[w] < this.number[root]) {
				if (this.stack.includes(w)) {
					this.lowlink[root] = Math.min(this.lowlink[root],
							this.number[w]);
				}
			}
		}

		// found scc
		if ((this.lowlink[root] == this.number[root]) && (this.stack.length > 0)) {
			var next = -1;
			var scc = [];

			do {
				next = this.stack[(this.stack.length - 1)];

				// this.stack.remove(stack.size() - 1);
				this.stack.splice((this.stack.length - 1), 1);
				scc.push(next);
			} while (this.number[next] > this.number[root]);

			// simple scc's with just one node will not be added
			if (scc.length > 1) {
				this.currentSCCs.push(scc);
			}
		}
	};

};