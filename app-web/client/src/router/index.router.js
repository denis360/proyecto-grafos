import { pages } from "../controllers/index.js";
const content = document.getElementById("app");

export const router = async (route) => {
  content.innerHTML = '';
  if (route == "#/" || route == "") {
    return content.appendChild(pages.home());
  }
  if (route == "#/roads") {
    return content.appendChild(await pages.ways());
  }
  if (route == "#/graphs") {
    return content.appendChild(await pages.graphs());
  }
  if (route == "#/map") {
    return content.appendChild(pages.map());
  }
  return content.innerHTML = `
      <h1>404</h1>
    `
}
