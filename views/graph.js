
let graph = {
    nodes: {
        AXY: {x: 150, y: 170} , 
        B: {x: 400, y: 220}, 
        C: {x: 220, y: 100}
    },
    //nodes: 'nodeLabel' : {x , y}
    //edges: [node, node], [node, node] 
    edges: [['AXY', 'B'] , ['B', 'C']],
    inQueue : [], // will be used on BFS
    visited : [] // will be used on BFS
    
}

canvasFlags = {
    addingNode: false,
    addingEdge: false,
    deletingNode: false,
    deletingEdge: false,
    onBFS: false

};

// ----- GRAPH FUNCTIONS -----
function checkValidlabel(label) {
    return label.length <= 3 && label.length > 0 && !graph.nodes[label];
}
function addNode(label, xx, yy) {
    if(checkValidlabel(label)) {

        graph.nodes[label] = {x: xx, y: yy};
        drawGraph();
        canvasFlags.addingNode = false;
    }
    else {
        logs = document.getElementById('graphLogs');
        logs.innerHtml = `"${label}" is not a valid name.`
    }
}


function deleteNode(label) {
    found = false;
    console.log(label);
    console.log(graph.nodes[label]);
    if(graph.nodes[label]){
        delete graph.nodes[label];
        found = true;
        console.log("found");
        graph.edges = graph.edges.filter(edge => edge[0] !== label && edge[1] !== label);
    }
    if(!found) {
        let logs = document.getElementById("graphLogs");
        logs.innerHtml = `"${label}" node does not exist.`;

    }
    drawGraph();
}


function addEdge(label1, label2) {
    console.log(graph.nodes[label1]);
    console.log(graph.nodes[label2]);
    canvasFlags.addingEdge = false;
    if(graph.nodes[label1] && graph.nodes[label2]){
        graph.edges.push([label1, label2]);
    }
    else {
            logs = document.getElementById('graphLogs');
            logs.innerHtml = 'The labels are not valid.';
    }
    drawGraph();
}

function deleteEdge(label1, label2) {
    console.log(label1, label2)
    canvasFlags.deletingEdge = false;
    if(graph.nodes[label1] && graph.nodes[label2]) {
        const newEdges = graph.edges.filter((edge) => !(edge[0] == label1 && edge[1] == label2 || edge[0] == label2 && edge[1] == label1));
        graph.edges = newEdges;
        drawGraph();

    }
    else {
        logs = document.getElementById('graphLogs');
        logs.innerHtml = 'The labels are not valid.';
    }
    drawGraph();
}



function BFSCycle() {
    let len = graph.inQueue.length;
    if(len == 0) {
        clearInterval(intervalId);
        canvasFlags.onBFS = false;

    }
    for(let i = 0; i < len; i++){
        const current = graph.inQueue.shift();
        graph.visited[current] = true;
        for(let edge of graph.edges) {
            if(edge[0] == current) {
                if(!(graph.inQueue.find(edge[1]) || graph.visited[edge[1]])){
                    graph.inQueue.push(edge[1]);
                }
            }
            else if(edge[1] == current) {
                if(!(graph.inQueue.find(edge[0]) || graph.visited[edge[0]])){
                    graph.inQueue.push(edge[0]);
                }
            }
        }
    }
}


function runBFS(label) {
    
    if(graph.nodes[label]){
        graph.inQueue.push(label);
       runBFSCycle();
       intervalId = setInterval(runBFSCycle, 2000); 
    }

}

// HANDLERS:

function openPopup(num) {
    if(num == 0) {
        let popup = document.getElementById("popup");
    popup.style.display = "block";
    }
    else {
        let popup2 = document.getElementById("popup2");
        popup2.style.display = "block";
    }
    
}

function closePopup(num) {

   if(num == 0) {
    let popup = document.getElementById("popup");
    popup.style.display = "none";
    const val = document.getElementById("nodeVal")
    label = val.value;
    if (canvasFlags.deletingNode) {
        deleteNode(label)
        console.log(graph);
        console.log("deleting")
    }
   }
   else {
    let popup2 = document.getElementById("popup2");
    popup2.style.display = "none";
    node1 = document.getElementById('node1')
    node2 = document.getElementById('node2')
    label1 = node1.value;
    label2 = node2.value;
        if (canvasFlags.addingEdge) {
            addEdge(label1, label2)
        console.log(graph);
        console.log('2x adding')
    }
    else if (canvasFlags.deletingEdge) {
        deleteEdge(label1, label2); 
        console.log(graph);
        console.log('2x deleting')
    }
    }
}

function addNodeHandler(e) {
    canvasFlags.addingNode = true;
    openPopup(0)
}

function deleteNodeHandler(e) {
    canvasFlags.deletingNode = true;
    openPopup(0)
}

function addEdgeHandler(e) {
    canvasFlags.addingEdge = true;
    openPopup(1)
}

function deleteEdgeHandler(e) {
    canvasFlags.deletingEdge = true;
    openPopup(1);
}

function runBFSHandler(e) {
    canvasFlags.onBFS = true;
    openPopup(0);
}



function clickHandler(e) {

    if (e.button === 0) {   
        const val = document.getElementById("nodeVal")
        label = val.value;
        if(canvasFlags.addingNode) {
            const rect = canvas.getBoundingClientRect()
            const x = Math.floor(e.clientX - rect.left)
            const y = Math.floor(e.clientY - rect.top)
            addNode(label, x, y);
            console.log(graph);
            console.log("adding");
        }
        
    }
    
}


/**
 TO DO:
 -> choose the pop up u open by checking which button u press
 -> addEdge, deleteEdge functional
 -> on change colors event
 -> BFS (button, function) 
 -> node js 
 */



function drawGraph() {
    let canvas = document.getElementsByTagName('canvas')[0]
    console.log(canvas);
    console.log(graph);
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgb(222, 222, 222)';
    ctx.fillRect(0, 0,  canvas.width, canvas.height);
    const nodeColor = document.getElementById("nodeColor");

    const edgeColor = document.getElementById("edgeColor");

    const visitedNodeColor = document.getElementById('visColor');


    ctx.strokeStyle = edgeColor.value;
    ctx.lineWidth = 3;
    const nodes = graph.nodes;
  for (const edge of graph.edges) {
    const sourceNode = edge[0];
    const targetNode = edge[1];

    const sourceCoords = nodes[sourceNode];
    const targetCoords = nodes[targetNode];
    console.log(`targetCoords: ${targetCoords}`)
    

    ctx.beginPath();
    ctx.moveTo(sourceCoords.x, sourceCoords.y);
    ctx.lineTo(targetCoords.x, targetCoords.y);
    ctx.stroke();
  }
    ctx.fillStyle = nodeColor.value;
    if(canvasFlags.onBFS){
        for(let node in graph.nodes){
            
            ctx.fillStyle = (graph.visited) ? visitedNodeColor.value : nodeColor.value;
            console.log(node);
            ctx.beginPath();
            ctx.arc(graph.nodes[node].x, graph.nodes[node].y, 16, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(node, graph.nodes[node].x, graph.nodes[node].y);
        }
    }
    else {
        for(let node in graph.nodes){
            ctx.fillStyle = nodeColor.value;
            console.log(node);
            ctx.beginPath();
            ctx.arc(graph.nodes[node].x, graph.nodes[node].y, 16, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(node, graph.nodes[node].x, graph.nodes[node].y);
        }
    }
    
}


window.onload = () => {
    canvas = document.getElementsByTagName("canvas")[0];
    canvas.addEventListener("click", clickHandler);
    console.log(canvas);
    console.log(``)
    drawGraph();
    addNodeButton = document.getElementById("addNode")
    deleteNodeButton = document.getElementById("deleteNode")
    addEdgeButton = document.getElementById("addEdge")
    deleteEdgeButton = document.getElementById("deleteEdge")
    runBFSButton = document.getElementById("runBFS");
    addNodeButton.addEventListener("click", addNodeHandler);
    deleteNodeButton.addEventListener("click", deleteNodeHandler);
    addEdgeButton.addEventListener("click", addEdgeHandler)
    deleteEdgeButton.addEventListener("click", deleteEdgeHandler)
    runBFSButton.addEventListener("click", runBFSHandler);
    ok1Button = document.getElementById('ok1')
    ok1Button.addEventListener("click", () => closePopup(0));
    ok2Button = document.getElementById("ok2");
    ok2Button.addEventListener('click', () => closePopup(1));
    let nodeColor = document.getElementById('nodeColor');
    let edgeColor = document.getElementById('edgeColor');

    nodeColor.onchange = drawGraph;
    edgeColor.onchange = drawGraph;
    //listener u have to add event to:
    
}