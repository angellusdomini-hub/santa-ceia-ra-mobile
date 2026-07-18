(() => {
  const guidePeople = window.SantaCeiaPeople || [];
  renderSantaCeiaNav("people");

  const select = document.querySelector("#personSelect");

  for (const person of guidePeople) {
    const option = document.createElement("option");
    option.value = person.id;
    option.textContent = `${person.id}. ${person.name}`;
    select.appendChild(option);
  }

  function showPerson(id) {
    const person = guidePeople.find((item) => item.id === Number(id)) || guidePeople[0];
    if (!person) return;
    select.value = person.id;
    document.querySelector("#bioNumber").textContent = person.id;
    document.querySelector("#bioName").textContent = person.name;
    document.querySelector("#bioText").textContent = person.text;
  }

  select.addEventListener("change", () => showPerson(select.value));
  showPerson(1);
})();
