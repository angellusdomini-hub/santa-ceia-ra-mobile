const pages = [
  {id:"home",href:"./index.html",icon:"⌂",label:"Início"},
  {id:"camera",href:"./camera.html",icon:"◎",label:"Câmera"},
  {id:"people",href:"./explorar.html",icon:"13",label:"Personagens"},
  {id:"about",href:"./sobre.html",icon:"✦",label:"Sobre"}
];

function renderSantaCeiaNav(active) {
  const nav = document.createElement("nav");
  nav.className = "bottom-nav";
  nav.setAttribute("aria-label", "Navegação principal");
  nav.innerHTML = pages.map((page) => `<a href="${page.href}"${page.id === active ? ' aria-current="page"' : ""}><span aria-hidden="true">${page.icon}</span>${page.label}</a>`).join("");
  document.body.appendChild(nav);
}
window.renderSantaCeiaNav = renderSantaCeiaNav;
