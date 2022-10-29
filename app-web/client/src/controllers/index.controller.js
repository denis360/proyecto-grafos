import viewHome from "../views/home.html";

export default () => {
  const div = document.createElement("div")
  div.innerHTML = viewHome;

  return div;
}
