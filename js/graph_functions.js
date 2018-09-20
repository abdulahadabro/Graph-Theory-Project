/**
 * Graph data Model
 */
var GRAPH = new function() {

	this.id = null; // optional
	this.edgedefault = "undirected";
	// graph title
	this.graphTitle = null;
	// graph id
	this.graphId = null;
	// graph Matrix contains the following
	// {
	// nodes : nodes, // nodes as string list as represented in the matrix
	// matrix : matrix,
	// size : size
	// }
	this.graphMatrix = null;
	/** all nodes of the graph * */
	this.allNodes = new Array();
	/** all edges of the graph * */
	this.allEdges = new Array();
	// node radius
	this.radius = 30;
	// content of file if read as txt
	this.fileContent = '';
	// all added edges as svg
	this.allSVGEdges = [];
	// all added nodes as svg
	this.allSVGNodes = [];
	// contains key attributes of graph
	this.keyList = [];

	// graph information
	this.isBipartite = null;
	this.isPlanner = null;

	this.allPathes = {};
	this.allCycles = {};

	this.isEulerian = false;
	this.isEulerPath = false;
	this.AllEulerTours = [];

	this.isHamiltonian = false;
	this.AllHamiltonPaths = [];
	this.AllHamiltonTours = [];

	this.graphMinNumOfColors = null;
	this.graphColors = null;

	this.isConnected = false;

	this.nodesDegrees = {};

	this.shortestPath = null;
	this.shortestPathCost = null;

	/**
	 * function to get graph size
	 */
	this.getGraphSize = function() {
		return this.allNodes.length;
	};
};

var NODE = new function() {
	this.id = null;
	this.name = null;
	this.data = null;// optional
	this.color = null;// optional
};

var EDGE = new function() {
	this.id = null; // optional
	this.source = null;
	this.target = null;
	this.weight = null;
	this.directed = false; // optional
	this.data = null; // optional
};

var KEY = new function() {
	this.id = null;
	this.keyFor = null;
	this.keyName = null;
	this.keyType = null;
	this.keyDefault = null;
};

function getGraphMatrix() {
	var v = [ 'a', 'b', 'c', 'd' ];
	var gM = [ [ 0, 1, 1, 0 ], [ 1, 0, 0, 1 ], [ 1, 0, 0, 1 ], [ 0, 1, 1, 0 ] ];
	return {
		nodes : v,
		matrix : gM,
		size : v.length
	};
}

function formGraphMatrix(graph) {
	var nodesIds = []; // only used to get index id
	for (var i = 0; i < graph.allNodes.length; i++) {
		nodesIds.push(graph.allNodes[i].id);
	}
	graph.nodesIds = nodesIds;
	var size = nodesIds.length;
	var matrix = zeroMatrix([ size, size ]);
	for (var i = 0; i < graph.allEdges.length; i++) {
		graph.allEdges[i].sourceIndex = nodesIds
				.indexOf(graph.allEdges[i].source);
		graph.allEdges[i].targetIndex = nodesIds
				.indexOf(graph.allEdges[i].target);

		matrix[graph.allEdges[i].sourceIndex][graph.allEdges[i].targetIndex]++;
		// make it asymmetric matrix // if not loop
		if (graph.allEdges[i].targetIndex != graph.allEdges[i].sourceIndex)
			matrix[graph.allEdges[i].targetIndex][graph.allEdges[i].sourceIndex]++;
	}

	graph.graphMatrix = {
		nodesIds : nodesIds, // don not use it
		matrix : matrix,
		size : size
	};

	return graph.graphMatrix;
}

function zeroMatrix(dimensions) {
	var array = [];

	for (var i = 0; i < dimensions[0]; ++i) {
		array
				.push(dimensions.length == 1 ? 0 : zeroMatrix(dimensions
						.slice(1)));
	}

	return array;
}

function drawGraphByMatrix(graphId) {

	// var graphNodes = MAIN_GRAPHS[graphId].graphMatrix.nodes;
	var graphNodes = MAIN_GRAPHS[graphId].allNodes;
	var graphMatrix = MAIN_GRAPHS[graphId].graphMatrix.matrix;
	var svgGraphNodes = [];

	for (var i = 0; i < graphNodes.length; i++) {
		var nodeOptions = $.extend(true, {}, {
			x : 100,
			y : 50,
		}, graphNodes[i]);

		svgGraphNodes.push(addNode(graphId, nodeOptions/*
														 * { id :
														 * graphNodes[i].id,
														 * name :
														 * graphNodes[i].name, x :
														 * 100, y : 50, }
														 */));
	}

	// connectNodes
	for (var i = 0; i < graphNodes.length; i++) {
		for (var j = 0; j < graphNodes.length; j++) {
			if (graphMatrix[i][j] == 1) {
				var edgeOptions = getEdgeOptions(graphId, svgGraphNodes[i],
						svgGraphNodes[j]);

				connectTwoNodes(graphId, svgGraphNodes[i], svgGraphNodes[j],
						edgeOptions /*
									 * { weight : null }
									 */, true);
			}

		}
	}
	// bring nodes to front
	bringNodesToFront(graphId);
	// for (var i = 0; i < svgGraphNodes.length; i++) {
	// var g = svgGraphNodes[i].nodeSvg;
	// g.parentElement.appendChild(g);
	// }

	// randomly display nodes without overlapping
	randomlySpreadNodes(graphId);
}

// function to put nodes above edges
function bringNodesToFront(graphId) {
	// bring nodes to front
	var svgGraphNodes = MAIN_GRAPHS[graphId].allSVGNodes;
	for (var i = 0; i < svgGraphNodes.length; i++) {
		var g = svgGraphNodes[i].nodeSvg;
		g.parentElement.appendChild(g);
	}
}

function randomlySpreadNodes(graphId) {
	var graphNodes = MAIN_GRAPHS[graphId].allSVGNodes;
	var size = MAIN_GRAPHS[graphId].getGraphSize();
	// get canvas dimintions
	var canvas = $('#' + graphId + 'Area');
	var width = canvas.parent().width() /*- 120*/;
	var height = canvas.parent().height() - 50/*- 120*/;
	// get nodes radius
	var radius = MAIN_GRAPHS[graphId].radius;
	var nodeDim = 2 * radius;

	setRandomPos(graphNodes, width, height, nodeDim);
	updateLinesPositions(graphId);

}

function updateNodePosition(graphId, node, x, y, r) {

	if (!graphId)
		graphId = CUURENT_OPEN_GRAPH;

	if (node.nodeSvg) {
		node = node.nodeSvg;
	}

	// var circle = node.nodeSvg.getElementsByTagName('circle')[0];
	// var text = node.nodeSvg.getElementsByTagName('text')[0];
	// var tooltipPoint = node.nodeSvg.getElementsByTagName('ellipse')[0];
	// var tooltip = node.nodeSvg.getElementsByTagName('rect')[0];
	// update node circle position
	var $circle = $(node).find('circle')[0];
	$circle.setAttribute('cx', x);
	$circle.setAttribute('cy', y);
	// circle.setAttribute('cx', x);
	// circle.setAttribute('cy', y);
	// update node text name
	// update text position
	var $text = $(node).find('text')[0];
	$text.setAttribute('x', x);
	$text.setAttribute('y', y);
	// text.setAttribute('x', x);
	// text.setAttribute('y', y);
	var radius;
	if (r) {
		radius = r;
	} else {
		radius = parseFloat($circle.getAttribute('r'));
	}
	// update tooltip and tooltipPoint
	var $tooltip = $(node).find('rect')[0];
	$tooltip.setAttribute('x', x - radius);
	$tooltip.setAttribute('y', y - radius - 10);
	// tooltip.setAttribute('x', x - radius);
	// tooltip.setAttribute('y', y - radius - 10);
	var $tooltipBtn = $(node).find('ellipse')[0];
	$tooltipBtn.setAttribute('cx', x - radius);
	$tooltipBtn.setAttribute('cy', y);
	// tooltipPoint.setAttribute('cx', x - radius);
	// tooltipPoint.setAttribute('cy', y);
	// update connect button
	var $connectBtn = $(node).find('.connect')[0];
	$connectBtn.setAttribute('x', x - radius + 2);
	$connectBtn.setAttribute('y', y - radius - 4);
	// var connectBtn = node.nodeSvg.getElementsByClassName('connect')[0];
	// connectBtn.setAttribute('x', x - radius + 2);
	// connectBtn.setAttribute('y', y - radius - 8);
	// update edit button
	var $editBtn = $(node).find('.edit')[0];
	$editBtn.setAttribute('x', x - radius + 2 + 16);
	$editBtn.setAttribute('y', y - radius - 4);
	// update delete button
	var $deleteBtn = $(node).find('.delete')[0];
	$deleteBtn.setAttribute('x', x - radius + 2 + 32);
	$deleteBtn.setAttribute('y', y - radius - 4);
}

function setRandomPos(elements, totalWidth, totalHeight, dim) {
	var boxDims = new Array();

	$(elements).each(
			function() {
				var conflict = true;
				var triesNum = 0;
				while (conflict) {
					triesNum++;
					fixLeft = Math
							.round(Math.random() * (totalWidth - 2 * dim))
							+ (dim / 2);
					fixTop = Math
							.round(Math.random() * (totalHeight - 2 * dim))
							+ (dim / 2);

					updateNodePosition(undefined, $(this)[0].nodeSvg, fixLeft
							+ dim / 2, fixTop + dim / 2);
					// $(this).offset({
					// left : fixLeft,
					// top : fixTop
					// });
					var box = {
						top : fixTop,
						left : fixLeft,
						width : dim,
						height : dim
					};
					// var box = {
					// top :
					// parseInt(window.getComputedStyle($(this)[0]).top),
					// left :
					// parseInt(window.getComputedStyle($(this)[0]).left),
					// width :
					// parseInt(window.getComputedStyle($(this)[0]).width),
					// height :
					// parseInt(window.getComputedStyle($(this)[0]).height)
					// };
					conflict = false;
					for (var i = 0; i < boxDims.length; i++) {
						if (!overlap(box, boxDims[i], dim) || (triesNum > 60)) {
							conflict = false;
						} else {
							conflict = true;
							break;

						}
					}
				}
				boxDims.push(box);

			});
}

function overlap(box1, box2, dim) {
	var x1 = box1.left;
	var y1 = box2.top;
	var h1 = box1.height;
	var w1 = box1.width;
	var b1 = y1 + h1;
	var r1 = x1 + w1;
	var x2 = box1.left;
	var y2 = box1.top;
	var h2 = box1.height;
	var w2 = box1.width;
	var b2 = y2 + h2;
	var r2 = x2 + w2;
	var buf = /* 24 */dim;
	if (b1 + buf < y2 || y1 > b2 + buf || r1 + buf < x2 || x1 > r2 + buf)
		return false;
	return true;
}

/**
 * function to check node keys and give values to nodes
 * 
 * @param myGraph
 */
function handleNodeKeys(myGraph) {

	if (!myGraph.keyList)
		return;
	// check if there is keys for nodes
	for (var i = 0; i < myGraph.keyList.length; i++) {

		var key = myGraph.keyList[i];
		// this.id = null;
		// this.keyFor = null;
		// this.keyName = null;
		// this.keyType = null;
		// this.keyDefault = null;
		if (key.keyFor == "node" && key.keyName == "color") {
			var keyId = key.id;
			var defaultValue = key.keyDefault;
			// loop over all edges and set weight
			for (var j = 0; j < myGraph.allNodes.length; j++) {
				var node = myGraph.allNodes[j];
				if (node.data != null && node.data.key == keyId) {
					// set value if exists or keyDefault if exists
					if (node.data.value != null) {
						node.color = node.data.value;
					} else if (defaultValue != null) {
						node.color = defaultValue;
					}
					// other wise leave it null
				} else {
					// if the node has no data .. apply default if exist
					if (defaultValue != null) {
						node.color = defaultValue;
					}

				}

			}

		}

	}
}

/**
 * function to check edge keys and give values to edges
 * 
 * @param myGraph
 */
function handleEdgeKeys(myGraph) {

	if (!myGraph.keyList)
		return;
	// check if there is keys for edges
	for (var i = 0; i < myGraph.keyList.length; i++) {

		var key = myGraph.keyList[i];
		// this.id = null;
		// this.keyFor = null;
		// this.keyName = null;
		// this.keyType = null;
		// this.keyDefault = null;
		if (key.keyFor == "edge" && key.keyName == "weight") {
			var keyId = key.id;
			var defaultValue = key.keyDefault;
			// loop over all edges and set weight
			for (var j = 0; j < myGraph.allEdges.length; j++) {
				var edge = myGraph.allEdges[j];
				if (edge.data != null && edge.data.key == keyId) {
					// set value if exists or keyDefault if exists
					if (edge.data.value != null) {

						if (key.keyType == "int")
							edge.weight = parseInt(edge.data.value);
						else
							edge.weight = parseFloat(edge.data.value);
					} else if (defaultValue != null) {
						if (key.keyType == "int")
							edge.weight = parseInt(defaultValue);
						else
							edge.weight = parseFloat(defaultValue);
					}
					// other wise leave it null

				}

			}

		}

	}

}

/**
 * function to get edge object between two nodes
 * 
 * @param graphId
 * @param node1
 * @param node2
 */
function getEdgeOptions(graphId, node1, node2) {

	for (var i = 0; i < MAIN_GRAPHS[graphId].allEdges.length; i++) {

		var edge = MAIN_GRAPHS[graphId].allEdges[i];
		this.source = null;
		this.target = null;
		if ((edge.source == node1.nodeId && edge.target == node2.nodeId)
				|| (edge.source == node2.nodeId && edge.target == node1.nodeId)) {
			return edge;
		}
	}
	// return default edge option
	return {
		weight : null
	};
}
/**
 * function to check if there is an edge between two nodes or not
 * 
 * @param node1
 * @param node2
 * @returns boolean
 */
function isEgdeExistBetweenTwoNodes(graphId, node1, node2) {
	var node1Id = ($(node1).parent()[0]).getAttribute('nodeId');
	var node2Id = ($(node2).parent()[0]).getAttribute('nodeId');
	var edgesList = MAIN_GRAPHS[graphId].allEdges;
	for (var i = 0; i < edgesList.length; i++) {
		var source = edgesList[i].source;
		var target = edgesList[i].target;

		if ((node1Id == source && node2Id == target)
				|| (node1Id == target && node2Id == source)) {
			return true;
		}
	}
	return false;
}
/**
 * function to check is an edge is already drawn in the graph
 * 
 * @param graphId
 * @param node1
 * @param node2
 */
function isEgdeAlreadyDrawn(graphId, node1, node2) {
	var node1Id = ($(node1).parent()[0]).getAttribute('nodeId');
	var node2Id = ($(node2).parent()[0]).getAttribute('nodeId');
	var edgesList = MAIN_GRAPHS[graphId].allSVGEdges;
	for (var i = 0; i < edgesList.length; i++) {
		var source = edgesList[i].source;
		var target = edgesList[i].target;

		if ((node1Id == source && node2Id == target)
				|| (node1Id == target && node2Id == source)) {
			return true;
		}
	}
	return false;
}
/**
 * function to get node obj given it is id
 * 
 * @param graphId
 * @param nodeId
 * @returns
 */
function getNodeOfId(graphId, nodeId) {
	var nodes = MAIN_GRAPHS[graphId].allNodes;
	for (var i = 0; i < nodes.length; i++) {
		if (nodes[i].id == nodeId) {
			return nodes[i];
		}
	}
	return null;
}