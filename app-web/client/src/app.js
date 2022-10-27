import { router } from "./router/index.router.js";

window.addEventListener("DOMContentLoaded", () => {

  router(window.location.hash)  
  window.addEventListener("hashchange", () => {
    router(window.location.hash)
  });
  
});
