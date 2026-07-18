const people = window.SantaCeiaPeople;
renderSantaCeiaNav("people");

const select = document.querySelector("#personSelect");
const hotspotLayer = document.querySelector("#guideHotspots");

for (const person of people) {
  const option = document.createElement("option");
  option.value = person.id;
  option.textContent = `${person.id}. ${person.name}`;
  select.appendChild(option);

  const button = document.createElement("button");
  button.type = "button";
  button.className = "hotspot";
  button.textContent = person.id;
  button.style.left = `${person.x}%`;
  button.style.top = `${person.y}%`;
  button.dataset.person = person.id;
  button.setAttribute("aria-label", `${person.id}. ${person.name}`);
  button.addEventListener("click", () => showPerson(person.id));
  hotspotLayer.appendChild(button);
}

function showPerson(id) {
  const person = people.find((item) => item.id === Number(id)) || people[0];
  select.value = person.id;
  document.querySelector("#bioNumber").textContent = person.id;
  document.querySelector("#bioName").textContent = person.name;
  document.querySelector("#bioText").textContent = person.text;
  document.querySelectorAll(".hotspot").forEach((button) => button.setAttribute("aria-pressed", String(Number(button.dataset.person) === person.id)));
}

select.addEventListener("change", () => showPerson(select.value));
showPerson(1);
