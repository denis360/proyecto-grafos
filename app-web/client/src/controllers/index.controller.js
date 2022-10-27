import viewHome from "../views/home.html";

export default () => {
  const div = document.createElement("div")
  div.classList.add("container", "pt-4");
  div.innerHTML = viewHome;

  return div;
}
