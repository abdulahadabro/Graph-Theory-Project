// function to upload and open new file
function openNewGraph() {
	// Check for the various File API support.
	if (window.File && window.FileReader && window.FileList && window.Blob) {
		// Great success! All the File APIs are supported.
		document.getElementById('files').addEventListener('change',
				handleFileSelect, false);
		// Setup the dnd listeners.
		var dropZone = document.getElementById('drop_zone');
		dropZone.addEventListener('dragover', handleDragOver, false);
		dropZone.addEventListener('drop', handleFileDrageSelect, false);
		// show dialog
		$('#openFileContainer #files')[0].value = "";
		$('#openFileContainer').addClass('show');

		$('#openFileContainer').bind('click', function(e) {
			if ((e.target === e.currentTarget) && e.target === this) {
				$('#openFileContainer').removeClass('show');
			}
			e.stopPropagation();
		});
	} else {
		alert('The File APIs are not fully supported in this browser.');
	}

}

function handleFileSelect(evt) {
	var files = evt.target.files; // FileList object
	readSelectedFile(files);
}
function handleFileDrageSelect(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	var files = evt.dataTransfer.files; // FileList object.
	readSelectedFile(files);
}
function handleDragOver(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

function readSelectedFile(files) {
	// files is a FileList of File objects. List some properties.
	// var output = [];
	for (var i = 0, f; f = files[i]; i++) {
		// output.push('<li><strong>', escape(f.name), '</strong> (', f.type
		// || 'n/a', ') - ', f.size, ' bytes, last modified: ',
		// f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString()
		// : 'n/a', '</li>');
		var reader = new FileReader();
		reader.onerror = errorHandler;
		reader.onabort = function(e) {
			alert('File read cancelled');
		};
		reader.onloadstart = function(e) {
			$('#openFileDaialog .spinner').addClass('show');
		};

		// Closure to capture the file information.
		reader.onload = (function(theFile) {
			return function(e) {
				// REad File
				var fileContent = e.target.result;
				var fileName = escape(theFile.name);
				$('#openFileDaialog .spinner').removeClass('show');
				$('#openFileContainer').removeClass('show');

				// handleFile
				parseSelectedFile(fileContent, fileName);
			};
		})(f);
		// Read in the image file as a data URL.
		// reader.readAsDataURL(f);
		reader.readAsText(f);

	}
}

function errorHandler(evt) {
	switch (evt.target.error.code) {
	case evt.target.error.NOT_FOUND_ERR:
		alert('File Not Found!');
		break;
	case evt.target.error.NOT_READABLE_ERR:
		alert('File is not readable');
		break;
	case evt.target.error.ABORT_ERR:
		break; // noop
	default:
		alert('An error occurred reading this file.');
	}

}
function updateProgress(evt) {
	// evt is an ProgressEvent.
	if (evt.lengthComputable) {
		var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
		// Increase the progress bar length.
		if (percentLoaded < 100) {
			$();
		}
	}
}

function parseSelectedFile(fileContent, fileName) {

	var parser = $.parseXML(fileContent);
	var xml = $(parser);
	var allGraphs = xml.find("graph");
	var keyList = [];

	$(xml.find("key")).each(
			function() {

				var id = this.id ? this.id : null;
				var keyFor = $(this).attr('for') ? $(this).attr('for') : null;
				var keyName = $(this).attr('attr.name') ? $(this).attr(
						'attr.name') : null;
				var keyType = $(this).attr('attr.type') ? $(this).attr(
						'attr.type') : null;
				var keyDefault = null;
				if ($(this).find('default')[0]) {
					var defaultValue = $(this).find('default')[0].innerHTML;
					keyDefault = defaultValue ? defaultValue : null;
				}
				var Key = $.extend(true, {}, KEY, {
					id : id,
					keyFor : keyFor,
					keyName : keyName,
					keyType : keyType,
					keyDefault : keyDefault,
				});
				keyList.push(Key);

			});

	// loop over all graphes in the document
	for (var i = 0; i < allGraphs.length; i++) {

		var graph = $(allGraphs[i]);
		// graph main values
		var myGraph = {
			id : graph.attr('id') ? graph.attr('id')
					: (new Date().getTime() + ""),
			graphTitle : graph.attr('id') ? graph.attr('id') : fileName,
			fileContent : fileContent,
			edgedefault : graph.attr('edgedefault') ? graph.attr('id')
					: "undirected",
			allNodes : [],
			allEdges : []
		};
		// add keys to graph if exists
		if (keyList.length > 0) {
			myGraph.keyList = keyList;
		}
		// parse nodes
		$(graph)
				.find("node")
				.each(
						function() {
							var nodeId = this.id ? this.id : new Date()
									.getTime()
									+ "";
							var nodeName = this.name ? this.name : this.id;
							var data = null;
							var nodeData = $(this).find('data')[0];
							if (nodeData) {
								data = {
									key : $(nodeData).attr('key'),
									value : nodeData.innerHTML ? nodeData.innerHTML
											: null
								};
							}
							var Node = $.extend(true, {}, NODE, {
								id : nodeId,
								name : nodeName,
								data : data
							});
							myGraph.allNodes.push(Node);
						});
		// parsing edges
		$(graph).find("edge").each(function() {
			var id = $(this).attr('id') ? $(this).attr('id') : null;
			var source = $(this).attr('source');
			var target = $(this).attr('target');
			var data = null;
			var nodeData = $(this).find('data')[0];
			if (nodeData) {
				data = {
					key : $(nodeData).attr('key'),
					value : nodeData.innerHTML ? nodeData.innerHTML
							: null
				};
			}
			var Edge = $.extend(true, {}, EDGE, {
				id : id,
				source : source,
				target : target,
				data :data
			});
			myGraph.allEdges.push(Edge);
		});
		// handle keys of nodes
		handleNodeKeys(myGraph);
		// handle keys of edges
		handleEdgeKeys(myGraph);
		formGraphMatrix(myGraph);
		createNewGraph(myGraph);
	}
}