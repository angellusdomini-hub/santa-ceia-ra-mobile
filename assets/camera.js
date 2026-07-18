const people = window.SantaCeiaPeople;
const targetToPerson = window.SantaCeiaTargetToPerson;
renderSantaCeiaNav("camera");

const scene = document.querySelector("#arScene");
const frame = document.querySelector("#scanFrame");
const pointsLayer = document.querySelector("#arPoints");
const startPanel = document.querySelector("#cameraStart");
const startButton = document.querySelector("#startCamera");
const stopButton = document.querySelector("#stopCamera");
const status = document.querySelector("#scanStatus");
const label = document.querySelector("#scanLabel");
const card = document.querySelector("#recognitionCard");
let activeTarget = null;
let lostTimer = null;
let started = false;

function buildPoints() {
  for (const person of people) {
    const marker = document.createElement("button");
    marker.className = "hotspot";
    marker.type = "button";
    marker.textContent = person.id;
    marker.style.left = `${person.x}%`;
    marker.style.top = `${person.y}%`;
    marker.setAttribute("aria-label", `${person.id}. ${person.name}`);
    marker.addEventListener("click", (event) => {
      event.stopPropagation();
      showPerson(person.id);
    });
    pointsLayer.appendChild(marker);
  }
}

function setAligned(aligned, message) {
  frame.classList.toggle("is-aligned", aligned);
  status.textContent = message;
  label.textContent = message;
}

function hideRecognition() {
  card.hidden = true;
}

function showPerson(personId) {
  const person = people.find((item) => item.id === personId);
  if (!person) return;
  document.querySelector("#recognitionNumber").textContent = `Personagem ${person.id}`;
  document.querySelector("#recognitionName").textContent = person.name;
  document.querySelector("#recognitionText").textContent = person.text;
  card.hidden = false;
}

function targetFound(index) {
  clearTimeout(lostTimer);
  activeTarget = index;
  setAligned(true, index === 0 ? "Pintura reconhecida — toque em um número" : "Personagem reconhecido");
  if (index === 0) {
    hideRecognition();
    pointsLayer.classList.add("is-visible");
  } else {
    pointsLayer.classList.remove("is-visible");
    showPerson(targetToPerson[index]);
  }
}

function targetLost(index) {
  if (activeTarget !== index) return;
  clearTimeout(lostTimer);
  lostTimer = setTimeout(() => {
    if (activeTarget !== index) return;
    activeTarget = null;
    setAligned(false, "Procurando a pintura…");
    pointsLayer.classList.remove("is-visible");
    hideRecognition();
  }, 900);
}

function whenSceneReady() {
  document.querySelectorAll("[data-target]").forEach((entity) => {
    const index = Number(entity.dataset.target);
    entity.addEventListener("targetFound", () => targetFound(index));
    entity.addEventListener("targetLost", () => targetLost(index));
  });
}

async function startCamera() {
  startButton.disabled = true;
  startButton.textContent = "Preparando reconhecimento…";
  try {
    if (window.location.protocol === "file:" || !window.isSecureContext) {
      status.textContent = "Abrindo a versão segura…";
      window.location.href = "https://angellusdomini-hub.github.io/santa-ceia-ra-mobile/camera.html";
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error("Este navegador não disponibiliza acesso à câmera.");
    }
    const system = scene.systems["mindar-image-system"];
    if (!system) throw new Error("O reconhecimento ainda não terminou de carregar. Tente novamente em alguns segundos.");
    await system.start();
    started = true;
    startPanel.hidden = true;
    stopButton.hidden = false;
    setAligned(false, "Procurando a pintura…");
  } catch (error) {
    let messageText = error.message || "Não foi possível abrir a câmera.";
    if (error.name === "NotAllowedError") messageText = "A permissão da câmera foi negada. Autorize o acesso nas configurações do navegador.";
    if (error.name === "NotFoundError") messageText = "Nenhuma câmera foi encontrada neste aparelho.";
    if (error.name === "NotReadableError") messageText = "A câmera está sendo usada por outro aplicativo.";
    startButton.disabled = false;
    startButton.textContent = "Tentar novamente";
    status.textContent = messageText;
    const message = startPanel.querySelector("p");
    message.textContent = `${messageText} Você pode continuar pelo guia manual.`;
  }
}

async function stopCamera() {
  if (started && scene.systems["mindar-image-system"]) await scene.systems["mindar-image-system"].stop();
  started = false;
  activeTarget = null;
  stopButton.hidden = true;
  startPanel.hidden = false;
  startButton.disabled = false;
  startButton.textContent = "Iniciar câmera";
  pointsLayer.classList.remove("is-visible");
  hideRecognition();
  setAligned(false, "Câmera desligada");
}

buildPoints();
if (scene.hasLoaded) whenSceneReady(); else scene.addEventListener("loaded", whenSceneReady, {once:true});
scene.addEventListener("arError", () => { status.textContent = "Não foi possível iniciar o reconhecimento neste aparelho."; });
startButton.addEventListener("click", startCamera);
stopButton.addEventListener("click", stopCamera);
document.querySelector("#closeRecognition").addEventListener("click", hideRecognition);
window.addEventListener("pagehide", () => { if (started && scene.systems["mindar-image-system"]) scene.systems["mindar-image-system"].stop(); });
