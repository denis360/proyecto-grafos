import viewMap from "../views/map.html";

export default () => {
  const div = document.createElement("div");
  div.innerHTML = viewMap;
  
  div.querySelector("#img").style.width = "665px";

  return div;
}

