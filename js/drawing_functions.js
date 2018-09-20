/**
 * function to draw and add a node for a graph
 */
function addNode(graphId, options) {

	if (!options) {
		options = {
			id : new Date().getTime() + "",
			name : "node",
			x : 100,
			y : 50,
		};
	}

	var radius = MAIN_GRAPHS[graphId].radius;
	// Node Group
	var gNode = makeSVG('g', {
		'class' : 'nodeGroup',
		'nodeId' : options.id
	});
	var nodeColor = options.color ? options.color : DEFAULT_NODE_COLOR;
	// create a circle node
	var circle = makeSVG('circle', {
		cx : options.x,
		cy : options.y,
		r : radius,
		stroke : '#262C37',
		'stroke-width' : 3,
		fill : nodeColor,
		'class' : 'node',
	});
	// add circle to the group
	gNode.appendChild(circle);
	if (options.name) {
		// create text name
		var text = makeSVG('text', {
			x : options.x,
			y : options.y,
			'text-anchor' : 'middle',
			stroke : 'black',
			'stroke-width' : 0,
			fill: '#fff',
			'class' : 'nodeName',
		}, options.name);
		// add text name to the group
		gNode.appendChild(text);
	}
	// create option button
	var toolTipBtn = makeSVG('ellipse', {
		cx : options.x - radius,
		cy : options.y,
		rx : "5",
		ry : "5",
		style : "fill:black;stroke:black;stroke-width:1",
		'onmouseover' : "showNodeTooltip(evt,true);",
		'onmousedown' : "showNodeTooltip(evt);",
	});
	// add option button to the group
	gNode.appendChild(toolTipBtn);
	// create tooltip option box for each node
	var tooltip = makeSVG('rect', {
		x : options.x + 60,
		y : options.y,
		width : "51",
		height : "25",
		fill : "#63caba",
		'text-anchor' : 'middle',
		'class' : 'nodeTootltip',
		visibility : "hidden",
	});
	// add tooltip option box for each node
	gNode.appendChild(tooltip);
	// create connect image button in tooltip { connect ,edit name, delete}
	var connectBtn = makeSVG('image', {
		x : options.x - radius + 2,
		y : options.y - radius - 4,
		height : "14px",
		width : "14px",
		'class' : 'buttons connect',
		href : "img/connect-from.png",
		xlink : href = "img/connect-from.png",
		visibility : "hidden",
	});
	// add connect image button to the group
	gNode.appendChild(connectBtn);

	// create edit image button in tooltip { connect , edit name, delete}
	var editBtn = makeSVG('image', {
		x : options.x - radius + 2 + 16,
		y : options.y - radius - 4,
		height : "14px",
		width : "14px",
		'class' : 'buttons edit',
		href : "img/edit.png",
		xlink : href = "img/edit.png",
		visibility : "hidden",
	});
	// add connect image button to the group
	gNode.appendChild(editBtn);
	// add click listener for node name edit button in tooltip
	$(editBtn)
			.bind(
					'mousedown',
					function(event, ui) {
						// find connected nodes
						var node = $(event.target).parent();
						var nodeName = NODE_NAME;
						if ($($(node)[0]).find('.nodeName').text() != nodeName
								&& isNodeNameUsed(graphId, nodeName)) {
							nodeName += NODES_COUNTER++;
						}
						// get the Id of the two nodes
						$($(node)[0]).find('.nodeName').text(nodeName);
						var nodeId = $(node)[0].getAttribute('nodeId');
						// update Node name in the graph data model
						for (var i = 0; i < MAIN_GRAPHS[graphId].allSVGNodes.length; i++) {
							if (MAIN_GRAPHS[graphId].allSVGNodes[i].nodeId == nodeId) {
								MAIN_GRAPHS[graphId].allSVGNodes[i].nodeText = nodeName;
								break;
							}
						}

						array = MAIN_GRAPHS[graphId].allNodes;
						for (var i = 0; i < array.length; i++) {
							if (array[i].id == nodeId) {
								array[i].name = nodeName;
								break;
							}
						}

						initializeFromToNodesCombobox();

					});
	// create delete image button in tooltip { connect , edit name, delete}
	var deleteBtn = makeSVG('image', {
		x : options.x - radius + 2 + 32,
		y : options.y - radius - 4,
		height : "14px",
		width : "14px",
		'class' : 'buttons delete',
		href : "img/small_delete.png",
		xlink : href = "img/small_delete.png",
		visibility : "hidden",
	});
	// add connect image button to the group
	gNode.appendChild(deleteBtn);

	// add click listener for delete button in tooltip
	$(deleteBtn).bind('mousedown', function(event, ui) {
		// find node to delete
		var node = $(event.target).parent();
		// get the Id of the node
		var nodeId = $(node)[0].getAttribute('nodeId');
		// delete all connected edges to this node
		deleteAllConnectedEdges(graphId, nodeId);
		// // delete Node from the graph data model
		for (var i = 0; i < MAIN_GRAPHS[graphId].allSVGNodes.length; i++) {
			if (MAIN_GRAPHS[graphId].allSVGNodes[i].nodeId == nodeId) {
				// delete from svg container
				MAIN_GRAPHS[graphId].allSVGNodes[i].nodeSvg.remove();
				// delete from list of svg nodes
				MAIN_GRAPHS[graphId].allSVGNodes.splice(i, 1);
				break;
			}
		}
		for (var i = 0; i < MAIN_GRAPHS[graphId].allNodes.length; i++) {
			if (MAIN_GRAPHS[graphId].allNodes[i].id == nodeId) {
				// delete from data model
				MAIN_GRAPHS[graphId].allNodes.splice(i, 1);
				break;
			}

		}
		// form Graph Matrix after operation
		formGraphMatrix(MAIN_GRAPHS[graphId]);
		initializeFromToNodesCombobox();

	});
	// Add the group to the chart
	$('#' + graphId + 'Area .svgContainer').append(gNode);
	// add click listener for connect button in tooltip
	$(connectBtn)
			.bind(
					'mousedown',
					function(event, ui) {
						if (IS_CONNECT_EVENT == 0) {
							// hide current tooltip
							// hideNodeTooltip(event);
							// change cursor to connecting
							$('.graphArea.selected').addClass('connecting');
							// change connect icon to connect-to
							setConnectIcon(event, true);
							// hold first node
							NODE_1_TOCONNECT = $(event.target).parent().find(
									'circle')[0];
							// prepare to connect
							IS_CONNECT_EVENT = 1;
						} else if (IS_CONNECT_EVENT == 1) {
							// hide current tooltip
							hideNodeTooltip(event);
							// change cursor to normal
							$('.graphArea.selected').removeClass('connecting');
							// change connect icon to connect-from
							setConnectIcon(event, false);
							// hold second node
							NODE_2_TOCONNECT = $(event.target).parent().find(
									'circle')[0];
							// connect two nodes
							connectTwoNodes(CUURENT_OPEN_GRAPH,
									NODE_1_TOCONNECT, NODE_2_TOCONNECT,
									undefined, false);
							// finish connect event
							IS_CONNECT_EVENT = 0;
							NODE_1_TOCONNECT = null;
							NODE_2_TOCONNECT = null;
						}
					});
	// add draggable event to the circle node
	$(circle).draggable().bind('mousedown', function(event, ui) {
		// bring target to front
		// $(event.target.parentElement).append(event.target);
	}).bind('drag', function(event, ui) {
		// update coordinates manually, since top/left style props don't
		// work on
		// SVG
		// Update coordinates manually, since SVG uses its own
		// attributes
		// event.target.setAttribute('cx', ui.position.left);
		// event.target.setAttribute('cy', ui.position.top);
		var position = ui.position;
		var $circle = $(this);
		var radius = $circle.prop('r').baseVal.value;
		var off_x = position.left - parseInt($circle.css('left'));
		var off_y = position.top - parseInt($circle.css('top'));

		var x = $circle.prop('cx').baseVal.value + off_x;
		var y = $circle.prop('cy').baseVal.value + off_y;
		updateNodePosition(graphId, $circle.parent(), x, y, radius);

		// $circle.prop('cx').baseVal.value += off_x;
		// $circle.prop('cy').baseVal.value += off_y;
		// // new values
		// var circleCX = $circle.prop('cx').baseVal.value;
		// var circleCY = $circle.prop('cy').baseVal.value;
		//
		// // update text position
		// $circle.parent().find('text')[0].setAttribute('x', circleCX);
		// $circle.parent().find('text')[0].setAttribute('y', circleCY);
		// // update tooltip and tooltipPoint
		// $circle.parent().find('rect')[0].setAttribute('x', circleCX
		// - radius);
		// $circle.parent().find('rect')[0].setAttribute('y', circleCY
		// - radius - 10);
		// $circle.parent().find('ellipse')[0].setAttribute('cx', circleCX
		// - radius);
		// $circle.parent().find('ellipse')[0]
		// .setAttribute('cy', circleCY);
		//
		// // update connect button
		// $circle.parent().find('.connect')[0].setAttribute('x', circleCX
		// - radius + 2);
		// $circle.parent().find('.connect')[0].setAttribute('y', circleCY
		// - radius - 8);
		// // update edit button
		// $circle.parent().find('.edit')[0].setAttribute('x', circleCX
		// - radius + 2 + 16);
		// $circle.parent().find('.edit')[0].setAttribute('y', circleCY
		// - radius - 8);
		// // update delete button
		// $circle.parent().find('.delete')[0].setAttribute('x', circleCX
		// - radius + 2 + 32);
		// $circle.parent().find('.delete')[0].setAttribute('y', circleCY
		// - radius - 8);

		updateLinesPositions();
	});

	// prepare node info to be add to chart data Model
	var nodeInfo = {
		nodeId : options.id,
		nodeText : options.name,
		nodeSvg : gNode,
		radius : radius,
	};

	// if this is the first node create list of nodes
	if (!MAIN_GRAPHS[graphId].allSVGNodes)
		MAIN_GRAPHS[graphId].allSVGNodes = [];
	// add node to list of nodes
	MAIN_GRAPHS[graphId].allSVGNodes.push(nodeInfo);

	return nodeInfo;
}

/**
 * create svg element with the given info
 * 
 * @param tag
 * @param attrs
 * @param content
 * @returns {___anonymous2230_2231}
 */
function makeSVG(tag, attrs, content) {
	var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
	for ( var k in attrs)
		el.setAttribute(k, attrs[k]);

	if (content)
		el.textContent = content;
	return el;
}

/**
 * function to connect two nodes by creating an edge between them
 * 
 * @param graphId
 * @param node_1
 * @param node_2
 */
function connectTwoNodes(graphId, node_1, node_2, options, isFromFile) {

	if (!options) {
		options = {
			weight : EDGE_WEIGHT
		};
	}
	// reference the two nodes
	var node1 = node_1;
	var node2 = node_2;
	if (typeof node_1.nodeSvg != "undefined") {
		node1 = node_1.nodeSvg.firstChild;
		node2 = node_2.nodeSvg.firstChild;
	}

	var isLoopEdge = node1 == node2 ? true : false;

	if (!isFromFile && isEgdeExistBetweenTwoNodes(graphId, node1, node2))
		return false;

	if (isEgdeAlreadyDrawn(graphId, node1, node2))
		return false;

	// Edge Group
	var eNode = makeSVG('g', {
		'class' : 'edgeGroup'
	});

	var x1 = parseFloat(node1.getAttribute('cx'));
	var y1 = parseFloat(node1.getAttribute('cy'));
	var x2 = parseFloat(node2.getAttribute('cx'));
	var y2 = parseFloat(node2.getAttribute('cy'));
	// create line edge element
	var line; // <path d="M130 110 C 0 250, 260 250, 130 110" stroke="blue"
	// stroke-width="5" fill="none" />
	var xCenter = (x1 + x2) / 2;
	var yCenter = (y1 + y2) / 2;

	if (isLoopEdge) {
		var x = node1.getAttribute('cx');
		var y = node1.getAttribute('cy');
		// M210 250 c -50 -290, -290 60, 0 0
		// var loopPath = 'M'+x+' '+y+' c -50 -290, -290 60, 0 0';
		var loopPath = 'M' + x + ' ' + y + ' c 0 -140, -140 60, 0 0';
		// var loopPath = 'M'+x+' '+y+' C 0 250, 260 250, '+x+' '+y;
		line = makeSVG('path', {
			'd' : loopPath,
			stroke : 'black',
			'stroke-width' : 2,
			fill : 'none',
			'class' : 'nodesLine loop'
		});
		xCenter = x - 52;
		yCenter = y - 30;

	} else {
		line = makeSVG('line', {
			x1 : node1.getAttribute('cx'),
			y1 : node1.getAttribute('cy'),
			x2 : node2.getAttribute('cx'),
			y2 : node2.getAttribute('cy'),
			stroke : 'black',
			'stroke-width' : 2,
			fill : 'blue',
			'class' : 'nodesLine'
		});
		xCenter = (x1 + x2) / 2;
		yCenter = (y1 + y2) / 2;
	}
	// add line edge to the group
	eNode.appendChild(line);

	// create edge weight text element

	// create text name
	var text = makeSVG('text', {
		x : xCenter - 10,
		y : yCenter - 5,
		'text-anchor' : 'middle',
		'font-size' : '13px',
		stroke : 'black',
		'stroke-width' : 1,
		'class' : 'edgeWeight',
	}, options.weight ? options.weight : '');
	// add text name to the group
	eNode.appendChild(text);

	// create option button
	var toolTipBtn = makeSVG('ellipse', {
		cx : xCenter,
		cy : yCenter,
		rx : "5",
		ry : "5",
		style : "fill:#FBA026;stroke:#F37934;stroke-width:2",
		'onmouseover' : "showEdgeTooltip(evt,true);",
		'onmousedown' : "showEdgeTooltip(evt);",
	});
	// add option button to the group
	eNode.appendChild(toolTipBtn);
	// create tooltip option box for each node
	var tooltip = makeSVG('rect', {
		x : xCenter + 60,
		y : yCenter,
		width : "37",
		height : "20",
		fill : "#63caba",
		'text-anchor' : 'middle',
		'class' : 'nodeTootltip',
		visibility : "hidden",
	});
	// add tooltip option box for each node
	eNode.appendChild(tooltip);
	// create edit image button in tooltip { edit weight, delete}
	var editBtn = makeSVG('image', {
		x : xCenter - 2,
		y : yCenter - 27,
		height : "14px",
		width : "14px",
		'class' : 'buttons edit',
		href : "img/edit.png",
		xlink : href = "img/edit.png",
		visibility : "hidden",
	});
	// add connect image button to the group
	eNode.appendChild(editBtn);
	// add click listener for delete button in tooltip
	$(editBtn).bind('mousedown', function(event, ui) {
		// find connected nodes
		var edge = $(event.target).parent();
		// get the Id of the two nodes
		var node1Id = $(edge)[0].getAttribute('node1Id');
		var node2Id = $(edge)[0].getAttribute('node2Id');
		// delete the svg edge with all its components
		// delete the edge from the graph model
		editEdgeWeight(graphId, node1Id, node2Id);
	});
	// create connect image button in tooltip { connect ,edit name, delete}
	var deleteBtn = makeSVG('image', {
		x : xCenter + 15,
		y : yCenter - 27,
		height : "14px",
		width : "14px",
		'class' : 'buttons delete',
		href : "img/small_delete.png",
		xlink : href = "img/small_delete.png",
		visibility : "hidden",
	});
	// add connect image button to the group
	eNode.appendChild(deleteBtn);

	// add click listener for delete button in tooltip
	$(deleteBtn).bind('mousedown', function(event, ui) {
		// find connected nodes
		var edge = $(event.target).parent();
		// get the Id of the two nodes
		var node1Id = $(edge)[0].getAttribute('node1Id');
		var node2Id = $(edge)[0].getAttribute('node2Id');
		// delete the svg edge with all its components
		// delete the edge from the graph model
		deleteEdge(graphId, node1Id, node2Id);
		// form Graph Matrix after operation
		formGraphMatrix(MAIN_GRAPHS[graphId]);

	});
	// set attributes to edge to know its nodes when deleteing it
	// TODO : every node should has id ,, set nodes ids for edge
	var node1Id = ($(node1).parent()[0]).getAttribute('nodeId');
	var node2Id = ($(node2).parent()[0]).getAttribute('nodeId');
	eNode.setAttribute('node1Id', node1Id);
	eNode.setAttribute('node2Id', node2Id);
	// prepare edge info to be added to the chart data model
	var lineInfo = {
		node1 : node1,
		node2 : node2,
		lineSvg : eNode,
		weight : options.weight
	};
	// combine all options
	lineInfo = $.extend(true, {}, lineInfo, options);
	// if this is the first edge , create list of edges
	if (!MAIN_GRAPHS[graphId].allSVGEdges)
		MAIN_GRAPHS[graphId].allSVGEdges = [];
	// add edge to list of edges
	MAIN_GRAPHS[graphId].allSVGEdges.push(lineInfo);
	// add node to graph data model // if not exists
	if (isFromFile != true) {
		MAIN_GRAPHS[graphId].allEdges.push({
			source : node1Id,
			target : node2Id,
			weight : options.weight
		});
		// form Graph Matrix after operation
		formGraphMatrix(MAIN_GRAPHS[graphId]);
	}

	// Add the group to the chart
	$('#' + graphId + 'Area .svgContainer').append(eNode);

	bringNodesToFront(graphId);
}

/**
 * to update line positions for a graph
 * 
 * @param graphId
 */
function updateLinesPositions(graphId) {
	if (!graphId)
		graphId = CUURENT_OPEN_GRAPH;

	var lines = MAIN_GRAPHS[graphId].allSVGEdges;
	for (var i = 0; i < lines.length; i++) {
		var node1 = lines[i].node1;
		var node2 = lines[i].node2;
		// var line = lines[i].lineSvg;
		var line = $(lines[i].lineSvg).find('.nodesLine')[0];

		var xCenter = 0;
		var yCenter = 0;

		if (line.hasClass('loop')) {

			var x = parseFloat(node1.getAttribute('cx'));
			var y = parseFloat(node1.getAttribute('cy'));
			xCenter = x - 52;
			yCenter = y - 30;

			var loopPath = 'M' + x + ' ' + y + ' c 0 -140, -140 60, 0 0';
			line.setAttribute('d', loopPath);
		} else {
			// update line positions
			line.setAttribute('x1', node1.getAttribute('cx'));
			line.setAttribute('y1', node1.getAttribute('cy'));
			line.setAttribute('x2', node2.getAttribute('cx'));
			line.setAttribute('y2', node2.getAttribute('cy'));
			// update weight position
			var x1 = parseFloat(node1.getAttribute('cx'));
			var y1 = parseFloat(node1.getAttribute('cy'));
			var x2 = parseFloat(node2.getAttribute('cx'));
			var y2 = parseFloat(node2.getAttribute('cy'));

			xCenter = (x1 + x2) / 2;
			yCenter = (y1 + y2) / 2;
		}
		var weight = $(lines[i].lineSvg).find('.edgeWeight')[0];
		weight.setAttribute('x', (xCenter - 10));
		weight.setAttribute('y', (yCenter - 5));
		// update control button options
		var ellipse = $(lines[i].lineSvg).find('ellipse')[0];
		ellipse.setAttribute('cx', xCenter);
		ellipse.setAttribute('cy', yCenter);
		// update tooltip box
		// update tooltip and tooltipPoint
		var r = ellipse.getAttribute('rx');
		var tooltipBox = $(lines[i].lineSvg).find('rect')[0];
		tooltipBox.setAttribute('x', xCenter - r);
		tooltipBox.setAttribute('y', yCenter - r - 25);
		// update edit button
		var editBtn = $(lines[i].lineSvg).find('.buttons.edit')[0];
		editBtn.setAttribute('x', xCenter - 2);
		editBtn.setAttribute('y', yCenter - 27);
		// update delete button
		var deleteBtn = $(lines[i].lineSvg).find('.buttons.delete')[0];
		deleteBtn.setAttribute('x', xCenter + 15);
		deleteBtn.setAttribute('y', yCenter - 27);

	}

}
/**
 * to give svg element some jquery functions
 */
function hackSVG() {
	if (SVGElement && SVGElement.prototype) {

		SVGElement.prototype.hasClass = function(className) {
			return new RegExp('(\\s|^)' + className + '(\\s|$)').test(this
					.getAttribute('class'));
		};

		SVGElement.prototype.addClass = function(className) {
			if (!this.hasClass(className)) {
				this.setAttribute('class', this.getAttribute('class') + ' '
						+ className);
			}
		};

		SVGElement.prototype.removeClass = function(className) {
			var removedClass = this.getAttribute('class').replace(
					new RegExp('(\\s|^)' + className + '(\\s|$)', 'g'), '$2');
			if (this.hasClass(className)) {
				this.setAttribute('class', removedClass);
			}
		};
		SVGElement.prototype.toggleClass = function(className) {
			if (this.hasClass(className)) {
				this.removeClass(className);
			} else {
				this.addClass(className);
			}
		};

	}
}

function showNodeTooltip(evt, isShowOnly) {
	var target = evt.target;
	var circle = $(target).parent().find('circle')[0];
	// console.log(evt);
	// tooltip.setAttributeNS(null,"visibility","visible");
	var tooltip = $(circle).parent().find('rect')[0];

	if (tooltip.getAttribute('visibility') == "hidden") {

		var r = circle.getAttribute('r');
		var x = circle.getAttribute('cx') - r;
		var y = circle.getAttribute('cy') - r - 10;
		tooltip.setAttributeNS(null, "x", x);
		tooltip.setAttributeNS(null, "y", y);

		tooltip.setAttributeNS(null, "visibility", "visible");
		var buttons = $(circle).parent().find('.buttons');
		for (var i = 0; i < buttons.length; i++) {
			buttons[i].setAttributeNS(null, "visibility", "visible");
		}
	} else if (isShowOnly != true) {
		// hide
		tooltip.setAttributeNS(null, "visibility", "hidden");
		var buttons = $(circle).parent().find('.buttons');
		for (var i = 0; i < buttons.length; i++) {
			buttons[i].setAttributeNS(null, "visibility", "hidden");
		}

	}

}
function showEdgeTooltip(evt, isShowOnly) {
	var target = evt.target;
	var ellipse = $(target).parent().find('ellipse')[0];
	var tooltip = $(target).parent().find('rect')[0];

	if (tooltip.getAttribute('visibility') == "hidden") {

		var r = ellipse.getAttribute('rx');
		var x = ellipse.getAttribute('cx') - r;
		var y = ellipse.getAttribute('cy') - r - 25;
		tooltip.setAttributeNS(null, "x", x);
		tooltip.setAttributeNS(null, "y", y);

		tooltip.setAttributeNS(null, "visibility", "visible");
		var buttons = $(ellipse).parent().find('.buttons');
		for (var i = 0; i < buttons.length; i++) {
			buttons[i].setAttributeNS(null, "visibility", "visible");
		}
	} else if (isShowOnly != true) {
		// hide
		tooltip.setAttributeNS(null, "visibility", "hidden");
		var buttons = $(ellipse).parent().find('.buttons');
		for (var i = 0; i < buttons.length; i++) {
			buttons[i].setAttributeNS(null, "visibility", "hidden");
		}

	}
}

/**
 * function to hide a tooltip of a node
 * 
 * @param evt
 */
function hideNodeTooltip(evt) {
	var circle = evt.target;
	var tooltip = $(circle).parent().find('rect')[0];
	tooltip.setAttributeNS(null, "visibility", "hidden");

	var buttons = $(circle).parent().find('.buttons');
	for (var i = 0; i < buttons.length; i++) {
		buttons[i].setAttributeNS(null, "visibility", "hidden");
	}
}

/**
 * finction for hide all tooltips in a graph
 * 
 * @param evt
 */
function hideAllNodeTooltip(evt) {
	var target = evt.target;
	var tooltips = $(target).find('rect');
	for (var i = 0; i < tooltips.length; i++) {
		tooltips[i].setAttributeNS(null, "visibility", "hidden");
	}

	var buttons = $(target).find('.buttons');
	for (var i = 0; i < buttons.length; i++) {
		buttons[i].setAttributeNS(null, "visibility", "hidden");
	}
}

/**
 * function to change the connect image icon from - to nodes
 * 
 * @param evt
 * @param isConnectTo
 */
function setConnectIcon(evt, isConnectTo) {
	var target = evt.target;
	var tooltips = $(target).parent().parent().find('.buttons.connect');
	for (var i = 0; i < tooltips.length; i++) {
		if (isConnectTo == true) {
			tooltips[i].setAttributeNS(null, "href",
					"img/connect-to.png");
			tooltips[i].setAttributeNS(null, "xlink",
					'href = "img/connect-to.png"');
		} else {
			tooltips[i].setAttributeNS(null, "href",
					"img/connect-from.png");
			tooltips[i].setAttributeNS(null, "xlink",
					'href = "img/connect-from.png"');
		}
	}
}
/**
 * function to delete edge from graph svg and graph model
 * 
 * @param graphId
 * @param node1Id
 * @param node2Id
 * @param event
 */
function deleteEdge(graphId, sourceNodeId, targetNodeId) {

	var array = MAIN_GRAPHS[graphId].allSVGEdges;
	for (var i = 0; i < array.length; i++) {
		var node1Id = $(array[i].node1).parent()[0].getAttribute('nodeId');
		var node2Id = $(array[i].node2).parent()[0].getAttribute('nodeId');
		if ((sourceNodeId == node1Id && targetNodeId == node2Id)
				|| (sourceNodeId == node2Id && targetNodeId == node1Id)) {
			var edgeSvg = array[i].lineSvg;
			// remove from svg elemetns
			edgeSvg.remove();
			array.splice(i, 1);
		}
	}
	array = MAIN_GRAPHS[graphId].allEdges;
	for (var i = 0; i < array.length; i++) {
		var source = array[i].source;
		var target = array[i].target;
		if ((sourceNodeId == source && targetNodeId == target)
				|| (sourceNodeId == target && targetNodeId == source)) {
			array.splice(i, 1);
		}
	}
	// TODO: call a function to recalculate graph parameters // num of edges ...
}

function deleteAllConnectedEdges(graphId, nodeId) {
	var array = MAIN_GRAPHS[graphId].allSVGEdges;
	for (var i = 0; i < array.length; i++) {
		var node1Id = $(array[i].node1).parent()[0].getAttribute('nodeId');
		var node2Id = $(array[i].node2).parent()[0].getAttribute('nodeId');
		if (nodeId == node1Id || nodeId == node2Id) {
			var edgeSvg = array[i].lineSvg;
			// remove from svg elemetns
			edgeSvg.remove();
			array.splice(i, 1);
			i--;
		}
	}

	array = MAIN_GRAPHS[graphId].allEdges;
	for (var i = 0; i < array.length; i++) {
		var source = array[i].source;
		var target = array[i].target;
		if (nodeId == source || nodeId == target) {
			array.splice(i, 1);
			i--;
		}
	}
}

function editEdgeWeight(graphId, sourceNodeId, targetNodeId) {
	var array = MAIN_GRAPHS[graphId].allSVGEdges;
	for (var i = 0; i < array.length; i++) {
		var node1Id = $(array[i].node1).parent()[0].getAttribute('nodeId');
		var node2Id = $(array[i].node2).parent()[0].getAttribute('nodeId');
		if ((sourceNodeId == node1Id && targetNodeId == node2Id)
				|| (sourceNodeId == node2Id && targetNodeId == node1Id)) {
			array[i].weight = EDGE_WEIGHT;
			var edgeSvg = array[i].lineSvg;
			if (EDGE_WEIGHT == null) {
				$($(edgeSvg).find('.edgeWeight')[0]).text("");
			} else
				$($(edgeSvg).find('.edgeWeight')[0]).text(array[i].weight);

			break;
		}
	}
	array = MAIN_GRAPHS[graphId].allEdges;
	for (var i = 0; i < array.length; i++) {
		var source = array[i].source;
		var target = array[i].target;
		if ((sourceNodeId == source && targetNodeId == target)
				|| (sourceNodeId == target && targetNodeId == source)) {
			array[i].weight = EDGE_WEIGHT;
			break;
		}
	}
}
/**
 * create General Info Panel
 * 
 * @param graphId
 */
function setChartInfoSubPanel(graphId) {
	var html = '<div class="chartGeneralInfo subPanel" >';
	// chart title and id
	html += '<div class="subPanelTitle row">General Information</div>'
			+ '<div class="row title">Graph Name: '
			+ MAIN_GRAPHS[graphId].graphTitle + '</div>';
	// num of nodes
	html += '<div class="row "> <div class="cell"># of Nodes: '
			+ MAIN_GRAPHS[graphId].getGraphSize()
			+ '</div> <div class="cell"># of Edges: '
			+ MAIN_GRAPHS[graphId].allEdges.length + '</div></div>';
	html += '</div><div class="left-panel-header">Result</div><div id="panel-result"></div>';
	var infoPanel = $('#secondPageInfoPanel');
	infoPanel.append($(html));

}

function createSubInfoPanel(graphId, panelOptions) {

	var html = '<div class="subPanel" ><div class="controlButtons" ><div class="minBtn" onClick="minimizeSubPanel(this)"></div><div class="closeBtn" onClick="closeSubPanel(this)"></div></div>';
	// panel Id
	html += '<div class="subPanelTitle row">' + panelOptions.title + '</div>';
	// panel rows
	for (var i = 0; i < panelOptions.rows.length; i++) {
		var row = panelOptions.rows[i];
		html += '<div class="row"><div class="rowLable">' + row.label
				+ ' : </div><div class="rowValue">' + row.value
				+ '</div></div>';
	}

	// // num of nodes
	// html += '<div class="row "> <div class="cell"># of Nodes: '
	// + MAIN_GRAPHS[graphId].getGraphSize()
	// + '</div> <div class="cell"># of Edges: '
	// + MAIN_GRAPHS[graphId].allEdges.length + '</div></div>';

	html += '</div>';
	var infoPanel = $('#panel-result');
	infoPanel.append($(html));
}
/**
 * function to minimize/maximize sub info panel
 * 
 * @param elm
 */
function minimizeSubPanel(elm) {
	var elem = $(elm);
	var panel = elem.parent().parent();
	if (elem.hasClass('max')) {
		// maximize Panel
		elem.removeClass('max');
		panel.css('max-height', 'initial');
	} else {
		// minmize Panel
		elem.addClass('max');
		panel.css('max-height', '22px');

	}

}
/**
 * function to remove sub info panel
 * 
 * @param elm
 */
function closeSubPanel(elm) {
	var elem = $(elm);
	var panel = elem.parent().parent();
	panel.remove();
}
/**
 * function to re color nodes array as given
 * 
 * @param graphId
 * @param colorArr
 */
function reColorNodes(graphId, colorArr) {

	// COLORS_LIST
	var nodesList = MAIN_GRAPHS[graphId].allNodes;
	var svgNodes = MAIN_GRAPHS[graphId].allSVGNodes;
	if (colorArr) {
		// use given colors
		for (var i = 0; i < svgNodes.length; i++) {
			var node = svgNodes[i];
			var color = colorArr[i] >= 0 ? COLORS_LIST[colorArr[i]] : '#fff';
			$($($(node.nodeSvg)[0]).find('.node')[0]).attr("fill", color);
		}
	} else {
		// use origenal colors if exists or default colors
		for (var i = 0; i < svgNodes.length; i++) {
			var node = svgNodes[i];
			var color = nodesList[i].color != null ? nodesList[i].color
					: DEFAULT_NODE_COLOR;
			$($($(node.nodeSvg)[0]).find('.node')[0]).attr("fill", color);
		}

	}

}

function isNodeNameUsed(graphId, nodeName) {
	var nodesList = MAIN_GRAPHS[graphId].allNodes;
	for (var i = 0; i < nodesList.length; i++) {
		if (nodesList[i].name == nodeName)
			return true;
	}
	return false;

}