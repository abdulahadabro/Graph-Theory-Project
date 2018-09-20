var DiVertex=new function(){this.id,this.name,this.createDiVertex=function(t,e){this.id=t,this.name=e},this.getId=function(){return this.id},this.getName=function(){return this.name},this.hashCode=function(){var t=1;return t=31*t+(null==this.id?0:this.id.hashCode())},this.equals=function(t){return this.id==t.id},this.toString=function(){return this.name}},DiEdge=new function(){this.id,this.source,this.destination,this.weight,this.createDiEdge=function(t,e,i,s){this.id=t,this.source=e,this.destination=i,this.weight=s},this.getId=function(){return this.id},this.getDestination=function(){return this.destination},this.getSource=function(){return this.source},this.getWeight=function(){return this.weight},this.toString=function(){return this.source+" "+this.destination}},DiGraph=new function(){this.vertexes,this.edges,this.createDiGraph=function(t,e){this.vertexes=t,this.edges=e},this.getVertexes=function(){return this.vertexes},this.getEdges=function(){return this.edges}},DijkstraAlgorithm=new function(){this.nodes,this.edges,this.settledNodes,this.unSettledNodes,this.predecessors,this.distance,this.createDijkstraAlgorithm=function(t){this.nodes=$.extend(!0,[],t.getVertexes()),this.edges=$.extend(!0,[],t.getEdges())},this.execute=function(t){for(this.settledNodes=[],this.unSettledNodes=[],this.distance={},this.predecessors={},this.distance[t]=0,this.pushToSet(this.unSettledNodes,t);this.unSettledNodes.length>0;){var e=this.getMinimum(this.unSettledNodes);this.pushToSet(this.settledNodes,e);var i=this.unSettledNodes.indexOf(e);this.unSettledNodes.splice(i,1),this.findMinimalDistances(e)}},this.findMinimalDistances=function(t){var e=this.getNeighbors(t);for(key in e){var i=e[key];this.getShortestDistance(i)>this.getShortestDistance(t)+this.getDistance(t,i)&&(this.distance[i]=this.getShortestDistance(t)+this.getDistance(t,i),this.predecessors[i]=t,this.pushToSet(this.unSettledNodes,i))}},this.getDistance=function(t,e){for(key in this.edges){var i=this.edges[key];if(i.getSource().id==t.id&&i.getDestination().id==e.id||i.getSource().id==e.id&&i.getDestination().id==t.id)return i.getWeight()}console.log("Error, Should not happen")},this.getNeighbors=function(t){var e=[];for(key in this.edges){var i=this.edges[key];i.getSource().id!=t.id||this.isSettled(i.getDestination())?i.getDestination().id!=t.id||this.isSettled(i.getSource())||this.pushToSet(e,i.getSource()):this.pushToSet(e,i.getDestination())}return e},this.getMinimum=function(t){var e=null;for(key in t){var i=t[key];null==e?e=i:this.getShortestDistance(i)<this.getShortestDistance(e)&&(e=i)}return e},this.pushToSet=function(t,e){for(var i=!1,s=0;s<t.length;s++)if(t[s].id==e.id){i=!0;break}0==i&&t.push(e)},this.isSettled=function(t){for(var e=0;e<this.settledNodes.length;e++)if(this.settledNodes[e].id==t.id)return!0;return!1},this.getShortestDistance=function(t){var e=this.distance[t];return null==e?Number.MAX_VALUE:e},this.getPath=function(t){var e=[],i=t;if(null==this.predecessors[i]||void 0===this.predecessors[i])return{path:null,distance:null};for(e.push(i);void 0!==this.predecessors[i];)i=this.predecessors[i],e.push(i);return e.reverse(),{path:e,distance:this.getShortestDistance(t)}}};