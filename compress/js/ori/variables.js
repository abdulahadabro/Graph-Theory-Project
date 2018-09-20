var NUM_OF_GRAPHS = 0;
var GRAPHS_ID_INC = 0;
var NODES_COUNTER = 0;
var CUURENT_OPEN_GRAPH = null;

var IS_CONNECT_EVENT = 0;
var NODE_1_TOCONNECT = null;
var NODE_2_TOCONNECT = null;
/**
 * Contains references to all created main graphs.
 */
var MAIN_GRAPHS = {};

// for adding node
var IS_MOUSE_DOWN = false;

var NODE_NAME = "V";
var EDGE_WEIGHT = null;

var IZOMORPHISM_WITH_ID = null;


var COLORS_LIST = [ 'LightCoral', 'LightSkyBlue',
		'SpringGreen', 'Wheat', 'Orange',
		'LightGrey', 'yellow' ];


var DEFAULT_NODE_COLOR = '#334760';