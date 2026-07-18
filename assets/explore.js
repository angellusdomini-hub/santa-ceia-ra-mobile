(() => {
  const guidePeople = window.SantaCeiaPeople || [];
  renderSantaCeiaNav("people");

  const select = document.querySelector("#personSelect");
  const hotspotLayer = document.querySelector("#guideHotspots");
  const tabs = [...document.querySelectorAll(".guide-tab")];
  const panels = [...document.querySelectorAll(".guide-panel")];

  for (const person of guidePeople) {
    const option = document.createElement("option");
    option.value = person.id;
    option.textContent = `${person.id}. ${person.name}`;
    select.appendChild(option);

    const hotspot = document.createElement("button");
    hotspot.className = "hotspot";
    hotspot.type = "button";
    hotspot.dataset.person = person.id;
    hotspot.style.left = `${person.x}%`;
    hotspot.style.top = `${person.y}%`;
    hotspot.setAttribute("aria-label", `${person.id}. ${person.name}`);
    hotspot.setAttribute("aria-pressed", "false");
    hotspot.textContent = person.id;
    hotspot.addEventListener("click", () => showPerson(person.id));
    hotspotLayer.appendChild(hotspot);
  }

  function showPerson(id) {
    const person = guidePeople.find((item) => item.id === Number(id)) || guidePeople[0];
    if (!person) return;
    select.value = person.id;
    document.querySelector("#bioNumber").textContent = person.id;
    document.querySelector("#bioName").textContent = person.name;
    document.querySelector("#bioText").textContent = person.text;
    hotspotLayer.querySelectorAll(".hotspot").forEach((hotspot) => {
      hotspot.setAttribute("aria-pressed", String(Number(hotspot.dataset.person) === person.id));
    });
  }

  function showPanel(tab) {
    const panelId = tab.getAttribute("aria-controls");
    tabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", String(active));
    });
    panels.forEach((panel) => {
      panel.hidden = panel.id !== panelId;
    });
  }

  select.addEventListener("change", () => showPerson(select.value));
  tabs.forEach((tab) => tab.addEventListener("click", () => showPanel(tab)));
  showPerson(1);
})();
