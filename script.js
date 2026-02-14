// --- Intro envelope ---
const intro = document.getElementById("intro");
const envelope = document.getElementById("openEnvelope");
const app = document.getElementById("app");

// --- App elements ---
const petalsContainer = document.getElementById("petals");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const success = document.getElementById("success");
const questionTitle = document.getElementById("questionTitle");
const buttonsRow = document.getElementById("buttonsRow");
const contentBox = document.getElementById("contentBox");

// Overlay image
const warningOverlay = document.getElementById("warningOverlay");

success.classList.add("hidden");
warningOverlay.classList.add("hidden");

// --- Petals ---
function spawnPetal() {
  const petal = document.createElement("div");
  petal.className = "petal";

  const startX = Math.random() * 100;
  const drift = (Math.random() * 40 - 20);
  const duration = 6 + Math.random() * 6;

  petal.style.left = `${startX}%`;
  petal.style.setProperty("--xStart", "0vw");
  petal.style.setProperty("--xEnd", `${drift}vw`);
  petal.style.animationDuration = `${duration}s`;

  petalsContainer.appendChild(petal);
  petal.addEventListener("animationend", () => petal.remove());
}
setInterval(spawnPetal, 180);

// --- Open envelope ---
function openEnvelope() {
  envelope.classList.add("open");
  setTimeout(() => intro.classList.add("fadeout"), 650);
  setTimeout(() => {
    intro.style.display = "none";
    app.classList.remove("hidden");
  }, 1100);
}
envelope.addEventListener("click", openEnvelope);
envelope.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") openEnvelope();
});

// --- Oui ---
yesBtn.addEventListener("click", () => {
  questionTitle.classList.add("hidden");
  buttonsRow.classList.add("hidden");
  warningOverlay.classList.add("hidden");
  success.classList.remove("hidden");
});

// --- Non ---
let attempts = 0;
let overlayTimer = null;

// remet le bouton Non à sa place normale
function resetNoButton() {
  noBtn.style.position = "";
  noBtn.style.left = "";
  noBtn.style.top = "";
  noBtn.style.transform = "";
}

// affiche l’image 3s puis remet l’écran comme avant
function showOverlayThenRestore() {
  questionTitle.classList.add("hidden");
  buttonsRow.classList.add("hidden");

  warningOverlay.classList.remove("hidden");

  if (overlayTimer) clearTimeout(overlayTimer);
  overlayTimer = setTimeout(() => {
    warningOverlay.classList.add("hidden");
    questionTitle.classList.remove("hidden");
    buttonsRow.classList.remove("hidden");

    resetNoButton();
    attempts = 0;
  }, 3000);
}

// Choisit une position ALÉATOIRE dans une zone "safe" autour de la carte centrale
function moveNoButtonInSafeArea() {
  // si success affiché, on ne bouge plus
  if (!success.classList.contains("hidden")) return;

  const paddingViewport = 12; // marge avec les bords de l'écran
  const safeMargin = 80;      // distance autour de la carte où il a le droit d'aller (augmente si tu veux plus loin)

  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;

  const btnW = noBtn.offsetWidth;
  const btnH = noBtn.offsetHeight;

  // rectangle de la carte
  const box = contentBox.getBoundingClientRect();

  // zone autorisée (autour de la carte)
  let minX = box.left - safeMargin;
  let maxX = box.right + safeMargin - btnW;
  let minY = box.top - safeMargin;
  let maxY = box.bottom + safeMargin - btnH;

  // clamp dans le viewport
  minX = Math.max(paddingViewport, minX);
  minY = Math.max(paddingViewport, minY);
  maxX = Math.min(vw - btnW - paddingViewport, maxX);
  maxY = Math.min(vh - btnH - paddingViewport, maxY);

  // sécurité si écran minuscule
  if (maxX < minX) maxX = minX;
  if (maxY < minY) maxY = minY;

  // position actuelle
  const current = noBtn.getBoundingClientRect();
  const curX = current.left;
  const curY = current.top;

  let x = curX;
  let y = curY;

  // on essaye plusieurs fois pour "bouger vraiment" sans sortir
  for (let i = 0; i < 12; i++) {
    const cx = Math.floor(minX + Math.random() * (maxX - minX));
    const cy = Math.floor(minY + Math.random() * (maxY - minY));
    const dist = Math.hypot(cx - curX, cy - curY);

    // distance minimale acceptable (ajuste si tu veux)
    if (dist > 140 || i === 11) {
      x = cx; y = cy;
      break;
    }
  }

  // placement dans le viewport
  noBtn.style.position = "fixed";
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
  noBtn.style.transform = "translateZ(0)";
}

function handleNoAttempt(e) {
  e.preventDefault();

  attempts++;

  // à chaque tentative : il bouge MAIS reste dans une zone visible
  moveNoButtonInSafeArea();

  // à 3 tentatives : image apparaît
  if (attempts >= 3) {
    showOverlayThenRestore();
  }
}

// déclenchement sur tentative réelle de clic/tap
noBtn.addEventListener("mousedown", handleNoAttempt);
noBtn.addEventListener("touchstart", handleNoAttempt, { passive: false });
noBtn.addEventListener("click", handleNoAttempt);
