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
const warningOverlay = document.getElementById("warningOverlay");
const bgMusic = document.getElementById("bgMusic");
const contentBox = document.querySelector(".content");

let attempts = 0;
let overlayTimer = null;

success.classList.add("hidden");
warningOverlay.classList.add("hidden");

// ---------------- PETALS ----------------
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

// ---------------- OPEN ENVELOPE ----------------
function openEnvelope() {
  envelope.classList.add("open");

  setTimeout(() => intro.classList.add("fadeout"), 600);

  setTimeout(() => {
    intro.style.display = "none";
    app.classList.remove("hidden");

    if (bgMusic) {
      bgMusic.volume = 0.5;
      bgMusic.play().catch(() => {});
    }
  }, 1100);
}

envelope.addEventListener("click", openEnvelope);

// ---------------- YES ----------------
yesBtn.addEventListener("click", () => {
  questionTitle.classList.add("hidden");
  buttonsRow.classList.add("hidden");
  warningOverlay.classList.add("hidden");
  success.classList.remove("hidden");
});

// ---------------- NON ----------------

function resetNoButton() {
  noBtn.style.position = "";
  noBtn.style.left = "";
  noBtn.style.top = "";
}

// Overlay image 3s puis retour normal
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

// Mouvement STRICTEMENT dans la carte blanche
function moveNoButtonSafe() {

  const rect = contentBox.getBoundingClientRect();

  const btnW = noBtn.offsetWidth;
  const btnH = noBtn.offsetHeight;

  const padding = 15;

  const maxX = rect.width - btnW - padding;
  const maxY = rect.height - btnH - padding;

  let x, y;
  let tries = 0;

  const current = noBtn.getBoundingClientRect();
  const curX = current.left - rect.left;
  const curY = current.top - rect.top;

  do {
    x = Math.random() * maxX;
    y = Math.random() * maxY;
    tries++;
  } while (Math.hypot(x - curX, y - curY) < 120 && tries < 12);

  noBtn.style.position = "absolute";
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
}

function handleNoClick(e) {
  e.preventDefault();

  if (!success.classList.contains("hidden")) return;

  attempts++;

  moveNoButtonSafe();

  if (attempts >= 3) {
    showOverlayThenRestore();
  }
}

noBtn.addEventListener("mousedown", handleNoClick);
noBtn.addEventListener("touchstart", handleNoClick, { passive: false });
noBtn.addEventListener("click", handleNoClick);
