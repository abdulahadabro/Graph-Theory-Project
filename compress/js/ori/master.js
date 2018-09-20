/**
 * The main Run starts from here
 */
$(document).ready(function() {
	hackSVG();
	// create left panel menu buttons
	createLeftPanelMenuButtons();

	// create drawing settings menu
	creatLeftPanelDrawingButtons();
	// create Main page layout
	createMainPageLayout($("#mainPageContainer"));
	// create user option panel
	createUserOptionPanel($("#mainPageInfoPanel"));

});

// function to close or open left menu
function closeOpenLeftPanel() {

	var leftPanelElement = $('#leftPanel');
	// check status and open or close it
	if (leftPanelElement.hasClass('closed')) {
		// it is closed .. open it
		leftPanelElement.removeClass('closed');
	} else {
		// it is open .. close it
		leftPanelElement.addClass('closed');
	}
}
/**
 * function to create Left Menu buttons
 */
function createLeftPanelMenuButtons() {
	var leftPanelElement = $('#leftPanelMenu');
	var html = "";
	html += "<div id='newMenuBtn' class='menuItem' onclick='createNewGraph()'><div class='menuIcon' />"
			+ "<div class='itemText'>New</div></div>";
	html += "<div id='openMenuBtn' class='menuItem' onclick='openNewGraph()' ><div class='menuIcon'/>"
			+ "<div class='itemText'>Open</div></div>";
	// html += "<div id='convertMenuBtn' class='menuItem'
	// onclick='convertCGraph()' ><div class='menuIcon' />"
	// + "<div class='itemText'>Convert</div></div>";
	html += "<div id='saveMenuBtn' class='menuItem' onclick='saveGraph()'  ><div class='menuIcon' />"
			+ "<div class='itemText'>Save</div></div>";
	// html += "<div id='saveAsMenuBtn' class='menuItem' onclick='saveGraphAS()'
	// ><div class='menuIcon'/>"
	// + "<div class='itemText'>Save as</div></div>";
	$(leftPanelElement).html(html);
}

function creatLeftPanelDrawingButtons() {
	var leftPanelElement = $('#leftPanelMenu');
	var html = "";
	html += "<div id='addNodeBtn' class='drawingMenuItem hiden' onclick='addNodeToGraph()'><div class='menuIcon' />"
			+ "<div class='itemText'>Add Node</div></div>";
	var nodeNameEdit = $('<div class="row hiden"><div class="lable" >Node Name:</div><div class="userInput value"><input type="text" name="nodeName" min="1" value="v" id="nodeNameEdit" onkeyup="changeNodeNameEdit(this)" onchange="changeNodeNameEdit(this)"/></div></div>');
	var edgeWeightEdit = $('<div class="row hiden"><div class="lable" >Edge Weight:</div><div class="userInput value"><input type="number" name="edgeWeight" min="0" value="0" id="edgeWeightEdit" onkeyup="changeEdgeWeightEdit(this)" onchange="changeEdgeWeightEdit(this)"/></div></div>');

	$(leftPanelElement).append(html);
	$(leftPanelElement).append(nodeNameEdit);
	$(leftPanelElement).append(edgeWeightEdit);
	// add event for dragging on this add node button
	$(leftPanelElement).find('#addNodeBtn').mousedown(function(event) {
		IS_MOUSE_DOWN = true;
		$('.graphArea.selected').addClass('grabbing');
	});
	$(document).mouseup(
			function(event) {
				if (IS_MOUSE_DOWN) {

					var elementClass = event.target.getAttribute('class');
					if (elementClass != null
							&& elementClass.indexOf("svgContainer") != -1
							&& elementClass.indexOf("show") != -1) {
						console.log(event.screenX);
						addNodeToGraph({
							x : event.offsetX,
							y : event.offsetY
						});
					}

				}
				IS_MOUSE_DOWN = false;
				$('.graphArea.selected').removeClass('grabbing');
			});
}

/**
 * create user options panel
 * 
 * @param element
 */
function createUserOptionPanel(element) {
	var selectedGraphHTML = $('<div class="row"><div class="lable" >Selected Graph:</div><div id="selectedGraph" class="value">none</div></div>');
	var otherGraphHTML = $("<div class='row comboboxHolder'><span>Other Graph:</span><div id='chartsCompobox' class='chartsCompobox value'></div>");
	var fromToNodesHTML = $("<div class='row comboboxHolder'><span>From node:</span><div id='fromNodeCompobox' class='nodesCompobox value'></div><span>To node:</span><div id='toNodeCompobox' class='nodesCompobox value'></div><br>");
	// var isbipartileHTML = $("<div class='row first'><input id='isBipartile'
	// type='checkbox' name='userOptions' ><span>Check if
	// Bipartile</span><br>");
	// var isPlannerHTML = $("<div class='row first'><input id='isPlanner'
	// type='checkbox' name='userOptions' ><span>Check if Planner</span><br>");
	var button = $("<div class='button' onclick='evaluateGraph()'><div class='lable'>Evaluate</div></div>");
	var chcekUncheckAllHTML = $("<div id='checkAll' ><input id='checkUnCheckAll' type='checkbox' name='mainChecker' onchange='checkUnCheckAll(this)' ><span>(un)check All</span></div>");

	var node_name_weight = '<div id="node-name-weight">';
	node_name_weight += 'Node Name: <input type="text" name="nodeName" min="1" value="v" id="nodeNameEdit" onkeyup="changeNodeNameEdit(this)" onchange="changeNodeNameEdit(this)">';
	
	node_name_weight +='Edge Weight: <input type="number" name="edgeWeight" min="0" value="0" id="edgeWeightEdit" onkeyup="changeEdgeWeightEdit(this)" onchange="changeEdgeWeightEdit(this)">';
	
	
	
	
	var firstPanel = $('<div class="leftUserOption"><div class="left-panel-header">Graph Information</div></div>');
	
	var general_info = $('<div class="general-info-details"></div>');
	
	general_info.append(selectedGraphHTML).append(otherGraphHTML).append(
			fromToNodesHTML).append(node_name_weight);
			
			//.append(button).append(chcekUncheckAllHTML)
			
	firstPanel.append(general_info);		

	var SecondPanel = $('<div class="rightUserOption"></div>');

	
	
	
	var isbipartileHTML = $("<div class='row'><div class='squared-checkbox'><input type='checkbox' id='isBipartile' name='userOptions'><label for='isBipartile'></label></div><span>Check if Bipartile</span><br>");
	var isPlannerHTML = $("<div class='row'><div class='squared-checkbox'><input id='isPlanner' type='checkbox' name='userOptions' ><label for='isPlanner'></label></div><span>Check if Planner</span><br>");
	var isTreeHTML = $("<div class='row'><div class='squared-checkbox'><input id='isTree' type='checkbox' name='userOptions'><label for='isTree'></label></div><span>Check if Tree</span><br>");
	var isAllPathesHTML = $("<div class='row'><div class='squared-checkbox'><input id='isListAllPathes' type='checkbox' name='userOptions'><label for='isListAllPathes'></label></div><span>List all paths of 1,2,3,... n length</span><br>");
	var isAllCirclesHTML = $("<div class='row'><div class='squared-checkbox'><input id='isListAllCycles'  type='checkbox' name='userOptions'><label for='isListAllCycles'></label></div><span>List all cycles (loops) of 3,4,,,,n length</span><br>");

	SecondPanel.append(isbipartileHTML).append(isPlannerHTML)
			.append(isTreeHTML).append(isAllPathesHTML)
			.append(isAllCirclesHTML);

	var lastPanel = $('<div class="lastUserOption"></div>');

	var isElurHTML = $("<div class='row'><div class='squared-checkbox'><input id='isTestEuler' type='checkbox' name='userOptions'><label for='isTestEuler'></label></div><span>List all Euler paths or cycles</span><br>");
	var isHamiltonHTML = $("<div class='row'><div class='squared-checkbox'><input id='isTestHamilton' type='checkbox' name='userOptions'><label for='isTestHamilton'></label></div><span>List all Hamilton paths and cycles</span><br>");
	var isColorGraphHTML = $("<div class='row'><div class='squared-checkbox'><input id='isColorRequired' type='checkbox' name='userOptions'><label for='isColorRequired'></label></div><span>Color the graph</span><br>");
	var isIzomorphismHTML = $("<div class='row'><div class='squared-checkbox'><input id='isIzomorphism' type='checkbox' name='userOptions'><label for='isIzomorphism'></label></div><span>Check Izomorphism with other graph</span>");
	var isShortPathHTML = $("<div class='row'><div class='squared-checkbox'><input id='isShortestPath' type='checkbox' name='userOptions'><label for='isShortestPath'></label></div><span>Short Path between Two Nodes</span><br>");

	lastPanel.append(isElurHTML).append(isHamiltonHTML)
			.append(isColorGraphHTML).append(isIzomorphismHTML).append(
					isShortPathHTML);
					
	var checkboxes = $('<div class="checkbox-options"></div>').append(SecondPanel).append(lastPanel);

	var checkbox_header = $('<div class="left-panel-header">Options</div>');

	element.append(firstPanel).append(checkbox_header).append(checkboxes);
	
	//element.append(firstPanel).append(SecondPanel).append(lastPanel);

	// initialize chart compobox
	initializeChartsCombobox();
	// initialize from to nodes Combo box
	initializeFromToNodesCombobox();

}

/**
 * To initialize the combo box of input data
 */
function initializeChartsCombobox() {

	// list of all charts
	var listOfCharts = [];
	for ( var chart in MAIN_GRAPHS) {
		listOfCharts.push(MAIN_GRAPHS[chart]);
	}
	if (listOfCharts.length == 0) {
		$("#chartsCompobox").html('');
		IZOMORPHISM_WITH_ID = null;
		return;
	}
	var compoboxHTML = '<select id="mCP" onchange="izomorphismChartInputChange(this)">';
	for (var i = 0; i < listOfCharts.length; i++) {
		compoboxHTML += '<option value="' + listOfCharts[i].graphId + '">'
				+ listOfCharts[i].graphTitle + '</option>';
	}
	compoboxHTML += '</select>';
	$("#chartsCompobox").html(compoboxHTML);
	IZOMORPHISM_WITH_ID = listOfCharts[0].graphId;

}

function initializeFromToNodesCombobox() {
	// selected graph id
	var selectedGraphId = CUURENT_OPEN_GRAPH;
	var graph = MAIN_GRAPHS[selectedGraphId];

	if (!graph || graph.allNodes.length == 0) {
		$("#fromNodeCompobox").html('');
		$("#toNodeCompobox").html('');
		FROM_NODE_ID = null;
		TO_NODE_ID = null;
		return;
	}
	var listOfNodes = graph.allNodes;
	// from node
	var compoboxHTML = '<select id="fromNodeCB" onchange="fromNodeSPInputChange(this)">';
	for (var i = 0; i < listOfNodes.length; i++) {
		compoboxHTML += '<option value="' + listOfNodes[i].id + '">'
				+ listOfNodes[i].name + '</option>';
	}
	compoboxHTML += '</select>';
	$("#fromNodeCompobox").html(compoboxHTML);
	// to node
	var compoboxHTML = '<select id="toNodeCB" onchange="toNodeSPInputChange(this)">';
	for (var i = 0; i < listOfNodes.length; i++) {
		compoboxHTML += '<option value="' + listOfNodes[i].id + '">'
				+ listOfNodes[i].name + '</option>';
	}
	compoboxHTML += '</select>';
	$("#toNodeCompobox").html(compoboxHTML);

	FROM_NODE_ID = listOfNodes[0].id;
	TO_NODE_ID = listOfNodes[0].id;
}

function fromNodeSPInputChange(comboBox) {
	var fromNodeId = comboBox.value;
	FROM_NODE_ID = fromNodeId;
}
function toNodeSPInputChange(comboBox) {
	var toNodeId = comboBox.value;
	TO_NODE_ID = toNodeId;
}

/**
 * When changing the izomorphism chart combo box
 * 
 * @param comboBox
 */
function izomorphismChartInputChange(comboBox) {

	var chartId = comboBox.value;
	IZOMORPHISM_WITH_ID = chartId;

}

/**
 * function to edit node name Variable from input
 */
function changeNodeNameEdit(element) {
	if (element.value.length > 0) {
		NODE_NAME = element.value;
	} else {
		element.value = "v";
	}
}
/**
 * function to edit edge weight Variable from input
 */
function changeEdgeWeightEdit(element) {
	if (element.value > 0) {
		EDGE_WEIGHT = element.value;
	} else {
		element.value = "0";
		EDGE_WEIGHT = null;
	}
}
/**
 * function to create main page layout
 */
function createMainPageLayout(element) {
	var html = "";
	html += "<div id='mainPageInfoPanel' ></div>";
	html += "<div id='mainPageGraphsContainer'>" + "<div id='MainTabs'></div>"
			+ "</div>";
	html += "<div id='secondPageInfoPanel'>" + "</div>";
	element.append($(html));
}

function checkUnCheckAll(element) {
	var allCheckBoxes = $('#mainPageInfoPanel').find('input');
	if (element.checked) {
		for (var i = 0; i < allCheckBoxes.length; i++) {
			if (allCheckBoxes[i].name == "userOptions") {
				allCheckBoxes[i].checked = true;
			}
		}
	} else {
		for (var i = 0; i < allCheckBoxes.length; i++) {
			if (allCheckBoxes[i].name == "userOptions") {
				allCheckBoxes[i].checked = false;
			}
		}
	}
}

/**
 * function to be called when click on Evaluate button
 */
function evaluateGraph(graphId) {

	if (!graphId)
		graphId = CUURENT_OPEN_GRAPH;

	var infoPanel = $('#secondPageInfoPanel');
	// clear info panel
	infoPanel.html('');

	if (graphId == null) {
		alert('Please Create/Open a gaph first!');
		return false;
	}
	// set Chart info subPanel
	setChartInfoSubPanel(graphId);

	if (MAIN_GRAPHS[graphId].getGraphSize() == 0) {
		// alert('Graph is Empty !, nth to evaluate');
		return false;
	}
	// 
	formGraphMatrix(MAIN_GRAPHS[graphId]);

	// nodes degrees
	findAllDegrees(graphId);
	var degreesSet = MAIN_GRAPHS[graphId].nodesDegrees;
	var rows = [];
	for (key in degreesSet) {
		var valueString = degreesSet[key] == 1 ? ('  ' + degreesSet[key] + ' Node ')
				: ('  ' + degreesSet[key] + ' Nodes ');
		rows.push({
			label : 'Degree of (' + key + ')  ',
			value : valueString
		});
	}
	if (rows.length > 0) {
		createSubInfoPanel(graphId, {
			title : 'Degree of Nodes',
			rows : rows
		});
	}

	// is bipartitle
	if ($('#isBipartile')[0].checked) {
		// Check Biprate
		// if coloring is not required show biprate coloring
		var isBipColoring = true;
		if ($('#isColorRequired')[0].checked) {
			isBipColoring = false;
		}
		isGraphBipartitle(graphId, {
			isColorNodes : isBipColoring
		});
		// create Biprate sub Info panel
		createSubInfoPanel(
				graphId,
				{
					title : 'Bipartite Test',
					rows : [ {
						label : 'Is Bipartite',
						value : MAIN_GRAPHS[graphId].isBipartite == null ? 'Not Evaluated !'
								: (MAIN_GRAPHS[graphId].isBipartite ? 'Yes'
										: 'No')
					} ]
				});
	}
	// is Planner
	if ($('#isPlanner')[0].checked) {
		// Check Planner
		isGraphPlanner(graphId);
		// create Planner sub Info panel
		createSubInfoPanel(graphId, {
			title : 'Planer Test',
			rows : [ {
				label : 'Is Planner',
				value : MAIN_GRAPHS[graphId].isPlanner ? 'Yes' : 'No'
			} ]
		});
	}

	// list All Pathes
	if ($('#isListAllPathes')[0].checked) {
		// get from ,to nodes
		if (FROM_NODE_ID != null && TO_NODE_ID != null) {

			findAllPathesWithAllLengths(graphId, FROM_NODE_ID, TO_NODE_ID);
			var rows = [];
			for (PathLength in MAIN_GRAPHS[graphId].allPathes) {

				var pathesHtml = "";
				var array = MAIN_GRAPHS[graphId].allPathes[PathLength];
				if (array.length > 0) {

					if (array.length == 1) {
						pathesHtml += ("(" + array.length + " Path found):");
					} else
						pathesHtml += ("(" + array.length + " Paths found):");

					pathesHtml += "<br>";
					for (var i = 0; i < array.length; i++) {
						pathesHtml += array[i].toString();
						pathesHtml += "<br>";
					}

					var row = {
						label : 'Length ' + PathLength,
						value : pathesHtml
					};
					rows.push(row);
					// console.log("L " + PathLength + " is "
					// + MAIN_GRAPHS[graphId].allPathes[PathLength]);
				}
			}
			var fromNode = getNodeOfId(graphId, FROM_NODE_ID);
			var toNode = getNodeOfId(graphId, TO_NODE_ID);
			// create Planner sub Info panel
			if (rows.length == 0) {
				// graph has no cycles at all
				// create Planner sub Info panel
				createSubInfoPanel(graphId, {
					title : 'All Pathes (from: ' + fromNode.name + ' - to: '
							+ toNode.name + ')',
					rows : [ {
						label : 'No Pathes between these two points',
						value : ""
					} ]
				});

			} else {
				createSubInfoPanel(graphId, {
					title : 'All Pathes (from: ' + fromNode.name + ' - to: '
							+ toNode.name + ')',
					rows : rows
				});
			}
		}
	}

	// list All Cycles // is Tree tes
	if ($('#isListAllCycles')[0].checked || $('#isTree')[0].checked) {
		// get from ,to nodes

		findAllCyclesWithAllLengths(graphId);
		if ($('#isListAllCycles')[0].checked) {
			var rows = [];
			for (cycleLength in MAIN_GRAPHS[graphId].allCycles) {
				var pathesHtml = "";
				var array = MAIN_GRAPHS[graphId].allCycles[cycleLength];
				if (array.length > 0) {

					if (array.length == 1) {
						pathesHtml += ("(" + array.length + " Cycle found):");
					} else
						pathesHtml += ("(" + array.length + " Cycles found):");

					pathesHtml += "<br>";
					for (var i = 0; i < array.length; i++) {
						pathesHtml += array[i].toString();
						pathesHtml += "<br>";
					}

					var row = {
						label : 'Length ' + cycleLength,
						value : pathesHtml
					};
					rows.push(row);
				}
			}

			if (rows.length == 0) {
				// graph has no cycles at all
				// create Planner sub Info panel
				createSubInfoPanel(graphId, {
					title : 'All Cycles',
					rows : [ {
						label : 'No Cycles in the Graph',
						value : ""
					} ]
				});

			} else {
				// create Planner sub Info panel
				createSubInfoPanel(graphId, {
					title : 'All Cycles',
					rows : rows
				});
			}

		}
		// is tree
		if ($('#isTree')[0].checked) {

			// check connected
			var isConnected = isGraphConnected(graphId);
			// check cycles
			var isCyclic = false;
			for (cycleLength in MAIN_GRAPHS[graphId].allCycles) {
				var array = MAIN_GRAPHS[graphId].allCycles[cycleLength];
				if (array.length > 0) {
					isCyclic = true;
					break;
				}
			}
			var isTree = isConnected == true && isCyclic == false;

			// create Planner sub Info panel
			createSubInfoPanel(graphId, {
				title : 'Tree Test',
				rows : [ {
					label : 'Is Tree',
					value : isTree ? 'Yes' : 'No'
				} ]
			});
			// graph is Tree

		}

	}

	// is Euler
	if ($('#isTestEuler')[0].checked) {
		// Check Euler
		TestForEuler(graphId);
		if (MAIN_GRAPHS[graphId].isEulerian == false) {
			createSubInfoPanel(graphId, {
				title : 'Euler Path or Cycle',
				rows : [ {
					label : 'Graph is NOT Eulerian',
					value : ""
				} ]
			});

		} else {

			var rows = [];
			var lable = MAIN_GRAPHS[graphId].isEulerPath ? "Euler Paths"
					: "Euler Cycles";
			var numberOfPaths = MAIN_GRAPHS[graphId].AllEulerTours.length;
			var pathesHtml = "";
			if (numberOfPaths > 0) {
				if (numberOfPaths == 1) {
					if (MAIN_GRAPHS[graphId].isEulerPath)
						pathesHtml += ("(" + numberOfPaths + " Path found):");
					else
						pathesHtml += ("(" + numberOfPaths + " Cycle found):");
				} else {
					if (MAIN_GRAPHS[graphId].isEulerPath)
						pathesHtml += ("(" + numberOfPaths + " Paths found):");
					else
						pathesHtml += ("(" + numberOfPaths + " Cycles found):");
				}
				pathesHtml += "<br>";
				for (var i = 0; i < numberOfPaths; i++) {
					var array = MAIN_GRAPHS[graphId].AllEulerTours[i];
					pathesHtml += array.toString();
					pathesHtml += "<br>";
				}
				var row = {
					label : lable,
					value : pathesHtml
				};
				rows.push(row);
			}

			if (rows.length == 0) {
				createSubInfoPanel(graphId, {
					title : 'Euler Path or Cycle',
					rows : [ {
						label : 'Graph is NOT Eulerian',
						value : ""
					} ]
				});

			} else {
				// create Planner sub Info panel
				createSubInfoPanel(graphId, {
					title : 'Euler Path or Cycle',
					rows : rows
				});
			}
		}
	}

	// test hamilton
	if ($('#isTestHamilton')[0].checked) {
		// Check hamilton
		TestForHamilton(graphId);
		if (MAIN_GRAPHS[graphId].isHamiltonian == false) {
			createSubInfoPanel(graphId, {
				title : 'Hamilton Path and Cycle',
				rows : [ {
					label : 'Graph is NOT Hamiltonian',
					value : ""
				} ]
			});

		} else {

			var rows = [];
			// Paths
			var lable = "Hamilton Paths";
			var numberOfPaths = MAIN_GRAPHS[graphId].AllHamiltonPaths.length;
			var pathesHtml = "";
			if (numberOfPaths > 0) {
				if (numberOfPaths == 1) {
					pathesHtml += ("(" + numberOfPaths + " Path found):");
				} else {
					pathesHtml += ("(" + numberOfPaths + " Paths found):");
				}
				pathesHtml += "<br>";
				for (var i = 0; i < numberOfPaths; i++) {
					var array = MAIN_GRAPHS[graphId].AllHamiltonPaths[i];
					pathesHtml += array.toString();
					pathesHtml += "<br>";
				}
				var row = {
					label : lable,
					value : pathesHtml
				};
				rows.push(row);
			}
			// cycles
			var lable = "Hamilton Cycles";
			var numberOfPaths = MAIN_GRAPHS[graphId].AllHamiltonTours.length;
			var pathesHtml = "";
			if (numberOfPaths > 0) {
				if (numberOfPaths == 1) {
					pathesHtml += ("(" + numberOfPaths + " Cycle found):");
				} else {
					pathesHtml += ("(" + numberOfPaths + " Cycles found):");
				}
				pathesHtml += "<br>";
				for (var i = 0; i < numberOfPaths; i++) {
					var array = MAIN_GRAPHS[graphId].AllHamiltonTours[i];
					pathesHtml += array.toString();
					pathesHtml += "<br>";
				}
				var row = {
					label : lable,
					value : pathesHtml
				};
				rows.push(row);
			}

			if (rows.length == 0) {
				createSubInfoPanel(graphId, {
					title : 'Hamilton Path and Cycle',
					rows : [ {
						label : 'Graph is NOT Hamiltonian',
						value : ""
					} ]
				});
			} else {
				// create Planner sub Info panel
				createSubInfoPanel(graphId, {
					title : 'Hamilton Path/Cycle',
					rows : rows
				});
			}
		}
	}

	if ($('#isColorRequired')[0].checked) {
		// graph coloring
		colorGraphWithBacktraking(graphId);
		// create Planner sub Info panel
		createSubInfoPanel(graphId, {
			title : 'Coloring',
			rows : [ {
				label : 'num Of used colors',
				value : MAIN_GRAPHS[graphId].graphMinNumOfColors
			} ]
		});
	}
	// Izomorphism
	if ($('#isIzomorphism')[0].checked) {
		var graph1 = MAIN_GRAPHS[graphId].graphTitle;
		var graph2 = MAIN_GRAPHS[IZOMORPHISM_WITH_ID].graphTitle;

		if (IZOMORPHISM_WITH_ID == null || IZOMORPHISM_WITH_ID == graphId) {

			createSubInfoPanel(graphId, {
				title : 'Izomorphism Test for ( ' + graph1 + '  and  ' + graph2
						+ ')',
				rows : [ {
					label : 'is Izomorphisim',
					value : 'Yes , they are the same graph !'
				} ]
			});
		} else {

			// check izomorphism variants between graphs
			var test = checkifIzomorphism(graphId, IZOMORPHISM_WITH_ID);
			if (test.isIzo == false) {
				createSubInfoPanel(graphId, {
					title : 'Izomorphism Test for ( ' + graph1 + '  and  '
							+ graph2 + ')',
					rows : [ {
						label : 'is Izomorphisim',
						value : 'No , they are not'
					}, {
						label : 'invariant',
						value : test.invariants[0]
					} ]
				});
			} else {
				createSubInfoPanel(graphId, {
					title : 'Izomorphism Test for ( ' + graph1 + '  and  '
							+ graph2 + ')',
					rows : [ {
						label : 'is Izomorphisim',
						value : 'They Could be'
					}, {
						label : 'invariant',
						value : 'No invariants found'
					} ]
				});
			}

		}

	}
	// shortest path
	if ($('#isShortestPath')[0].checked) {
		// shortest Path
		if (FROM_NODE_ID != null && TO_NODE_ID != null) {
			var fromNode = getNodeOfId(graphId, FROM_NODE_ID);
			var toNode = getNodeOfId(graphId, TO_NODE_ID);
			if (FROM_NODE_ID == TO_NODE_ID) {
				MAIN_GRAPHS[graphId].shortestPath = [ fromNode.name ];
				MAIN_GRAPHS[graphId].shortestPathCost = 0;
			} else {
				findShortPath(graphId, FROM_NODE_ID, TO_NODE_ID);
			}

			// create sub Info panel
			var path = MAIN_GRAPHS[graphId].shortestPath;
			var cost = MAIN_GRAPHS[graphId].shortestPathCost;
			if (path == null) {
				createSubInfoPanel(graphId, {
					title : 'Shortest Path (from: ' + fromNode.name + ' - to: '
							+ toNode.name + ')',
					rows : [ {
						label : 'No Path exists',
						value : ''
					} ]
				});
			} else {
				createSubInfoPanel(graphId, {
					title : 'Shortest Path (from: ' + fromNode.name + ' - to: '
							+ toNode.name + ')',
					rows : [ {
						label : 'Shortest Path',
						value : path.toString()
					}, {
						label : 'Shortest Path Distance',
						value : cost
					} ]
				});
			}
		}
	}

}

/**
 * function to create new graph area
 */
function createNewGraph(graphOptions) {
	
	$('#MainTabs').show();
	$('#mainPageInfoPanel').show();
	$('#node-name-weight').show();
	
	

	if (!graphOptions)
		graphOptions = {};

	graphOptions = $.extend(true, {}, GRAPH, graphOptions);

	var container = $("#mainPageGraphsContainer");
	var grapHeaderContainer = $("#MainTabs");

	if (NUM_OF_GRAPHS < 20) {
		NUM_OF_GRAPHS++;
		GRAPHS_ID_INC++;
		var graphId = "graph" + GRAPHS_ID_INC;
		var graphHeaderHtml = $("<div id="
				+ graphId
				+ "Header class='graphAreaHeader'><div class='title'>Graph"
				+ GRAPHS_ID_INC
				+ " </div><div class='changeBetween'></div><div class='closeGraph'></div></div>");
		graphHeaderHtml
				.click(function(e) {

					if (e.target.className == "closeGraph") {
						$('#' + graphId + 'Header').remove();
						$('#' + graphId + 'Area').remove();
						delete MAIN_GRAPHS[graphId];
						NUM_OF_GRAPHS--;
						initializeChartsCombobox();
						if (NUM_OF_GRAPHS > 0) {
							// get last graphId
							var i = 0;
							for ( var property in MAIN_GRAPHS) {
								if (MAIN_GRAPHS.hasOwnProperty(property)) {
									i++;
									if (i < NUM_OF_GRAPHS)
										continue;
									// do stuff
									// MAIN_GRAPHS[property].graphTitle
									selectGraph(property);
									break;
								}
							}
						} else {
							// hide drawing menu
							$('.drawingMenuItem').addClass('hiden');
							$('.row').addClass('hiden');
							// update selected graph
							$('.row #selectedGraph').html('none');
							initializeFromToNodesCombobox();
						}
					} else if (e.target.className.indexOf('changeBetween') !== -1) {
						// change between svg and text
						// if ($('#' + graphId + 'Area .svgContainer').hasClass(
						// 'show')) {
						if (document.querySelector(
								'#' + graphId + 'Area .svgContainer').hasClass(
								'show')) {
							// hide svg ,, show text
							document.querySelector(
									'#' + graphId + 'Area .svgContainer')
									.removeClass('show');
							$('#' + graphId + 'Area .graphTextArea').addClass(
									'show');
							// change icon
							$('#' + graphId + 'Header .changeBetween')
									.addClass('graphIcon');

						} else {
							// hide text ,, show svg
							document.querySelector(
									'#' + graphId + 'Area .svgContainer')
									.addClass('show');
							$('#' + graphId + 'Area .graphTextArea')
									.removeClass('show');
							// change icon
							$('#' + graphId + 'Header .changeBetween')
									.removeClass('graphIcon');

						}
					} else {
						selectGraph(graphId);
					}
					e.stopPropagation();

				});

		var graphAreaHtml = $("<div id="
				+ graphId
				+ "Area class='graphArea' ><svg class='svgContainer show' xmlns='http://www.w3.org/2000/svg' // onmousedown='hideAllNodeTooltip(evt);',></svg><div class='graphTextArea' >"
				+ graphOptions.fileContent + "</div></div>");

		container.append(graphAreaHtml);
		// in order not to take it as xml
		graphAreaHtml.find('.graphTextArea').text(graphOptions.fileContent);
		// set height of svg
		var minHeight = 534; //parseInt(container.css('height')) - 30;
		graphAreaHtml.find('svg').css('min-height', minHeight + 'px');
		graphAreaHtml.find('.graphTextArea')
				.css('min-height', minHeight + 'px');
		grapHeaderContainer.append(graphHeaderHtml);
		if (!MAIN_GRAPHS[graphId]) {
			MAIN_GRAPHS[graphId] = $.extend(true, {}, graphOptions, {
				graphTitle : "Graph" + GRAPHS_ID_INC,
				graphId : graphId,
			});
		}
		if (MAIN_GRAPHS[graphId].graphMatrix != null) {
			drawGraphByMatrix(graphId);
		}
		selectGraph(graphId);
		initializeChartsCombobox();
	} else {
		alert("Maximum number of open graphs is 5 ,, please close to continue");
	}
}
/**
 * function to be called when selecting a graph header
 * 
 * @param graphId
 */
function selectGraph(graphId) {
	$('.graphAreaHeader').removeClass('selected');
	$('.graphArea').removeClass('selected');

	$('#' + graphId + 'Header').addClass('selected');
	$('#' + graphId + 'Area').addClass('selected');

	CUURENT_OPEN_GRAPH = graphId;

	// updete in user optin
	var title = $('#' + graphId + 'Header').find('.title').html();
	$('.row #selectedGraph').html(title);

	initializeFromToNodesCombobox();
	// show add node button
	$('.drawingMenuItem').removeClass('hiden');
	$('.row').removeClass('hiden');

	// update panel Info
	evaluateGraph(graphId);
}

/**
 * function to save current open graph and download it
 */
function saveGraph() {

	var graphId = CUURENT_OPEN_GRAPH;

	if (graphId == null) {
		alert("So selected Graph to save, Create one!");
		return;
	}

	var fileXMLContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
	fileXMLContent += '<!-- This file was written by the Grapher project using GraphML format-->\n';
	fileXMLContent += '<graphml xmlns="http://graphml.graphdrawing.org/xmlns"  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ';
	fileXMLContent += 'xsi:schemaLocation="http://graphml.graphdrawing.org/xmlns http://graphml.graphdrawing.org/xmlns/1.0/graphml.xsd">\n';

	// add color key
	fileXMLContent += '<key id="d0" for="node" attr.name="color" attr.type="string"/>\n';
	// add weight key
	fileXMLContent += '<key id="d1" for="edge" attr.name="weight" attr.type="double"/>\n';

	// add graph info
	fileXMLContent += '<graph id="' + graphId + '" edgedefault="undirected">\n';
	// add graph nodes
	for (var i = 0; i < MAIN_GRAPHS[graphId].allNodes.length; i++) {
		var node = MAIN_GRAPHS[graphId].allNodes[i];

		fileXMLContent += '<node id="' + /* node.id */node.name + '">\n';

		if (node.color != null) {
			// add color to node
			fileXMLContent += '<data key="d0">' + node.color + '</data>';
		}
		fileXMLContent += '</node>\n';
	}
	// add graph edges
	for (var i = 0; i < MAIN_GRAPHS[graphId].allEdges.length; i++) {
		var edge = MAIN_GRAPHS[graphId].allEdges[i];
		var edgeId = typeof edge.id == "undefined" ? ("e" + i) : edge.id;

		var sourceNode = getNodeOfId(graphId, edge.source);
		if (sourceNode == null)
			sourceNode = {
				name : edge.source
			};
		var targetNode = getNodeOfId(graphId, edge.target);
		if (targetNode == null)
			targetNode = {
				name : edge.target
			};
		fileXMLContent += '<edge id="' + edgeId + '" source="'
				+ sourceNode.name + '" target="' + targetNode.name + '">\n';

		if (edge.weight != null) {
			// add weight to edge
			fileXMLContent += '<data key="d1">' + edge.weight + '</data>\n';
		}
		fileXMLContent += '</edge>\n';
	}

	fileXMLContent += '</graph>\n';
	fileXMLContent += '</graphml>\n';

	var pom = document.createElement('a');

	var filename = (MAIN_GRAPHS[graphId].graphTitle + "FileGraphml.xml");
	var pom = document.createElement('a');
	var bb = new Blob([ fileXMLContent ], {
		type : 'text/plain'
	});

	pom.setAttribute('href', window.URL.createObjectURL(bb));
	pom.setAttribute('download', filename);

	pom.dataset.downloadurl = [ 'text/plain', pom.download, pom.href ]
			.join(':');
	pom.draggable = true;
	pom.classList.add('dragout');

	pom.click();
}
function saveGraphAS() {
	connectNodes(CUURENT_OPEN_GRAPH);
}

function addNodeToGraph(options) {
	
	if (!options) {
		options = {
			x : 100,
			y : 50,
		};
	}

	if (CUURENT_OPEN_GRAPH !== null) {
		var nodeOptions = {
			id : new Date().getTime() + "",
			name : NODE_NAME + NODES_COUNTER /* 'v' + NODES_COUNTER */,
			x : options.x,
			y : options.y,
		};
		addNode(CUURENT_OPEN_GRAPH, nodeOptions);
		// add node info to graph data model
		MAIN_GRAPHS[CUURENT_OPEN_GRAPH].allNodes.push({
			id : nodeOptions.id,
			name : nodeOptions.name
		});
		NODES_COUNTER++;
		// form Graph Matrix after operation
		formGraphMatrix(MAIN_GRAPHS[CUURENT_OPEN_GRAPH]);
		initializeFromToNodesCombobox();
	}
}
