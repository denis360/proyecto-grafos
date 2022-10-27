import viewGraph from "../views/graphs.html"

const colors = ["#FFCE30", "#E83845", "#746AB0", "#288BA8", "#00FF7F", "#FF5733", "#40E0D0", "#6A5ACD", "#7B68EE", "#D3D3D3"]

class DemoForceDirectedLayout extends go.ForceDirectedLayout {
  makeNetwork(coll) {
    const net = super.makeNetwork(coll);
    net.vertexes.each(vertex => {
      const node = vertex.node;
      if (node !== null) vertex.isFixed = node.isSelected;
    });
    return net;
  }
}

function random (colors) {
  const index = Math.floor(
    Math.random() * colors.length
  );
  
  return colors[index];
}

function all(content, divA) {
  const html = divA.querySelector("#graph");
  html.innerHTML = '';
  html.innerHTML = `
    <div id="all"
      style="border: 1px solid black; background: white; width: 100%; height: 700px; position: relative; -webkit-tap-highlight-color: rgba(255, 255, 255, 0); cursor: auto;">
      <canvas tabindex="0" width="831" height="558"
        style="position: absolute; top: 0px; left: 0px; z-index: 2; user-select: none; touch-action: none; width: 1039px; height: 698px; cursor: auto;">This
      </canvas>
      <div style="position: absolute; overflow: auto; width: 1039px; height: 698px; z-index: 1;">
        <div style="position: absolute; width: 1px; height: 1px;"></div>
      </div>
    </div>
    <select id="myPaths" style="min-width:100px; display: none" size="10"></select>      
  `
  
  const $ = go.GraphObject.make;
  
  const myDiagram = $(go.Diagram, "all", {
    initialAutoScale: go.Diagram.Uniform,
    layout: new DemoForceDirectedLayout()
  });
  
  let nodes = [];
  const relations = [];

  for (const line of Object.keys(content)) {
    for (const estacion of content[line]["estaciones"]) {
      if (!nodes.includes(estacion)) {
        // nodes.push({key: estacion, text: estacion, color: random(colors)});
        nodes.push(estacion);
      }
    }
  
    Object.getOwnPropertyNames(content[line]["relaciones"]).forEach((e) => {
      content[line]["relaciones"][e].forEach((r) => {
        const [nombre, ] = r;
        relations.push({from: e, to: nombre});
      })
    })
  }
  
  nodes = nodes.map((e) => ({key: e, text: e, color: random(colors)}))

  myDiagram.nodeTemplate = $(go.Node, "Auto", 
    $(go.Shape, "Circle", {
      stroke: null
    }, new go.Binding("fill", "color")),
    $(go.TextBlock, {
      margin: 5, font: "18px sans-serif"
    }, new go.Binding("text")));
  
  myDiagram.model = new go.GraphLinksModel(nodes, relations);
  
}

export default async () => {
  const json = await fetch("http://localhost:5000/");
  const content = await json.json(); 

  const divA = document.createElement("div");
  divA.innerHTML = viewGraph;
  
  const body = divA.querySelector("#graphs-table");

  function onLine (line) {
    const html = divA.querySelector("#graph");
    const title = divA.querySelector("#title");
    title.innerText = `Grafo ${line}`;
    html.innerHTML = '';
    html.innerHTML = `
      <div id="${line}"
        style="border: 1px solid black; background: white; width: 100%; height: 700px; position: relative; -webkit-tap-highlight-color: rgba(255, 255, 255, 0); cursor: auto;">
        <canvas tabindex="0" width="831" height="558"
          style="position: absolute; top: 0px; left: 0px; z-index: 2; user-select: none; touch-action: none; width: 1039px; height: 698px; cursor: auto;">This
        </canvas>
        <div style="position: absolute; overflow: auto; width: 1039px; height: 698px; z-index: 1;">
          <div style="position: absolute; width: 1px; height: 1px;"></div>
        </div>
      </div>
      <select id="myPaths" style="min-width:100px; display: none" size="10"></select>      
    `
    
    const $ = go.GraphObject.make;
    
    const myDiagram = $(go.Diagram, line, {
      initialAutoScale: go.Diagram.Uniform,
      layout: new DemoForceDirectedLayout()
    });
        
    const nodes = content.content[line]["estaciones"].map((e, index) => ( {key: e, text: index+1, color: random(colors)} ))
    
    const relations = [];
    
    Object.getOwnPropertyNames(content.content[line]["relaciones"]).forEach((e) => {
      content.content[line]["relaciones"][e].forEach((r) => {
        const [nombre, ] = r
        relations.push({from: e, to: nombre});
      })
    })

    myDiagram.nodeTemplate = $(go.Node, "Auto", 
      $(go.Shape, "Circle", {
        stroke: null
      }, new go.Binding("fill", "color")),
    $(go.TextBlock, {
        margin: 5, font: "18px sans-serif"
      }, new go.Binding("text")));
    
    myDiagram.model = new go.GraphLinksModel(nodes, relations);
    
    divA.querySelector("#card-values").classList.remove("d-none");
    const table = divA.querySelector("#table-values");
    table.innerHTML = '';
    
    nodes.forEach((node) => {
      const row = table.insertRow();
      const {key, text} = node;
      
      row.innerHTML = `
        <td>${text}</td>
        <td>${key}</td>
      `
    })
    
  }
  
  const row = body.insertRow();
  row.innerHTML = `
    <td>Todo</td>
  `
  row.onclick = () => all(content.content, divA);

  Object.getOwnPropertyNames(content.content).forEach((line) => {
    const row = body.insertRow();
    row.innerHTML = `
      <td>${line}</td>
    `;
    row.onclick = () => onLine(line);
   });

  return divA;
}
