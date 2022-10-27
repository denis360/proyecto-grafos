import viewWays from "../views/roads.html"

export default async () => {
  const json = await fetch("http://localhost:5000/");
  const content = await json.json();

  const div = document.createElement("div");
  div.innerHTML = viewWays;

  const body = div.querySelector("#body-lines")
  const tableStations = div.querySelector("#table-stations");
  const bodyDatas = div.querySelector("#body-datas");

  const lines = Object.getOwnPropertyNames(content.content);

  lines.forEach((line) => {
    const newDiv = document.createElement("div");
    newDiv.innerHTML = `
      <div class="accordion-item bg-dark">
        <h2 class="accordion-header" id="${line.replace(/(\s)/g, "-h-")}">
          <button class="accordion-button bg-dark text-light collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${line.replace(/(\s)/g, "-c-")}" aria-expanded="false" aria-controls="${line.replace(/(\s)/g, "-h.")}">
            ${line}
          </button>
        </h2>
        <div id="${line.replace(/(\s)/g, "-c-")}" class="accordion-collapse collapse" aria-labelledby="${line.replace(/(\s)/g, "-h-")}" data-bs-parent="#body-lines">
          <ul class="list-group rounded-0" id="${line.replace(/(\s)/g, "-")}"></ul>
        </div>
      </div>
    `;

    body.appendChild(newDiv);
   });

  lines.forEach((line) => {
    const element = div.querySelector(`#${line.replace(/(\s)/g, "-")}`);
    if ( line.replace(/(\s)/g, "-")== element.id) {
      line, content.content[line]["estaciones"].forEach((e) => {
        const li = document.createElement("li");
        li.classList.add("list-group-item", "bg-dark", "text-light");
        li.innerText = e
        element.appendChild(li);
      })
    }
  });

  const estaciones = [];

  lines.forEach((linea) => {
    content.content[linea]["estaciones"].forEach((e) => {
      if (!estaciones.includes(e)) {
        estaciones.push(e);
      }
    });
  });

  function dfs (start, final, completed, grafo) {
    for (const node of grafo.nodos) {
      if (node["nombre"] !== start) {
        continue;
      }
      const {vertices_conectados} = node;
      for (const node_conected of vertices_conectados) {
        const [nombre, ] = node_conected;
        for (const _node of grafo.nodos) {
          if (nombre !== _node["nombre"]) {
            continue;
          }
          if (!_node["visitado"] && !completed) {
            _node["visitado"] = true;
            _node["predecesor"] = node["nombre"];
            if (_node["nombre"] == final) {
              completed = true;
            }
            dfs(_node["nombre"], final, completed, grafo);
          }
        }
      }
    }
  }

  function formar_ruta (ruta, inicio, destino, nodos) {
    for (const nodo of nodos) {
      if (nodo["nombre"] !== destino) {
        continue;
      }

      if (nodo["predecesor"] === null) {
        continue;
      }

      if (nodo["nombre"] === inicio) {
        ruta.estaciones.push([nodo["linea"], inicio]);
        return;
      }

      if (ruta.linea !== nodo["linea"]) {
        ruta.linea = nodo["linea"];
        ruta.transbordos.push([nodo["linea"], nodo["nombre"]]);
      }

      ruta.estaciones.push([nodo["linea"], nodo["nombre"]]);

      return formar_ruta(ruta, inicio, nodo["predecesor"], nodos);
    }
  }

  function distancia (estaciones, destino, nodos) {
    let distancia_ = 0;
    for (let i = 0; i<estaciones.length; i++) {
      const [, nombre] = estaciones[i];
      if (nombre == destino) {
        continue;
      }

      const [, siguiente] = estaciones[i+1];
      for (const nodo of nodos) {
        const {nodo_nombre, vertices_conectados} = nodo;
        if (siguiente === nodo_nombre) {
          continue;
        }
        for (const vertice of vertices_conectados) {
          if (vertice[0] === siguiente) {
            distancia_ += vertice[1];
          }
        }
      }
    }
    return distancia_;
  }

  const btn = div.querySelector("#submit");
  const alert = document.querySelector("#alert");
  btn.onclick = async () => {

    const json = await fetch("http://localhost:5000/");
    const content = await json.json();

    const start = div.querySelector("#start").value;
    const fin = div.querySelector("#fin").value;

    tableStations.innerHTML = '';
    bodyDatas.innerHTML = '';

    if (!estaciones.includes(start)) {
      alert.innerText = "No se encontro el punto de inicio."
      alert.classList.remove("d-none");
      return;
    }

    if (!estaciones.includes(fin)) {
      alert.innerText = "No se encontro el punto de destino."
      alert.classList.remove("d-none");
      return;
    }

    if (start == fin) {
      alert.innerText = "No se puede estabecler una ruta de esta misma estación";
      alert.classList.remove("d-none");
      return;
    }

    if (estaciones.includes(start) && estaciones.includes(fin)) {
      alert.classList.add("d-none");
    }

    const ruta = {linea: null, estaciones: [], distancia: 0, transbordos: []};
    const completed = false;

    dfs(start, fin, completed, content.grafo);
    formar_ruta(ruta, start, fin, content.grafo.nodos);

    ruta.estaciones.reverse();

    ruta.distancia = distancia(ruta.estaciones, fin, content.grafo.nodos);

    if (!ruta.estaciones.length) {
      return;
    }

    for (const e of ruta.estaciones) {
      const row = tableStations.insertRow();
      const [linea, estacion] = e;
      row.innerHTML = `
        <td>${linea}</td>
        <td>${estacion}</td>
        <td>
          ${ruta.transbordos.length > 1 ? ruta.transbordos.map((e) => e[1] === estacion ? "transbordo" : "").filter(Boolean) : ""}
        </td>
        <td>${estacion === start ? "Actual": estacion === fin ? "Destino": ""}</td>
      `;
    }

    const velocidad = 55000/60;
    const tiempo = (ruta.distancia/velocidad).toString().split(".")[0];

    bodyDatas.innerHTML = `
      <p>Total de estaciones: ${ruta.estaciones.length}</p>
      <p>Distancia: ${ruta.distancia > 999 ? ruta.distancia.toString().slice(0, -3)+" km" : ruta.distancia+" mts"}</p>
      <p>Tiempo estimado: ${tiempo} Minutos</p>
    `
  }
  const clear = div.querySelector("#clear");
  clear.onclick = () => {
    div.querySelector("#start").value = '';
    div.querySelector("#fin").value = '';
    div.querySelector("#body-datas").innerHTML = '';
    div.querySelector("#table-stations").innerHTML = '';
    div.querySelector("#start").focus();
  }
  return div;
}
