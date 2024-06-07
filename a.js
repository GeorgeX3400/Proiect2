let graph = {
    nodes: {
        AXY: {x: 150, y: 170} , 
        B: {x: 400, y: 220}, 
        C: {x: 220, y: 100}
    },
    //nodes: 'nodeLabel' : {x , y}
    //edges: [node, node], [node, node] 
    edges: [['AXY', 'B'] , ['B', 'C']],
    inQueue : [] // will be used on BFS

}

function iterateEdges(graph) {
    const nodes = graph.nodes;
    for (const edge of graph.edges) {
      const sourceNode = edge[0];
      const targetNode = edge[1];
  
      const sourceCoords = nodes[sourceNode];
      const targetCoords = nodes[targetNode];
  
      // Do something with the coordinates, e.g., print or use for visualization
      console.log(`Edge: ${sourceNode} -> ${targetNode}`);
      console.log(`  Source coordinates: (${sourceCoords.x}, ${sourceCoords.y})`);
      console.log(`  Target coordinates: (${targetCoords.x}, ${targetCoords.y})`);
    }
  }
  
  iterateEdges(graph)
