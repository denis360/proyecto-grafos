import Home from "./index.controller.js";
import Ways from "./roads.controller.js";
import Graphs from "./graphs.controller.js";
import Map from "./map.controller.js";

// lista de paginas que contiene la SPA(Single Page Application)
const pages = {
  home: Home,
  ways: Ways,
  graphs: Graphs,
  map: Map
}

export { pages };

