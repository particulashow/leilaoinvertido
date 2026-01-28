const params = new URLSearchParams(location.search);

const theme = (params.get("theme") || "dark").toLowerCase();
document.documentElement.dataset.theme = theme;

const minutes = Math.max(1, parseInt(params.get("minutes") || "60", 10));
const title = params.get("title") || "LEILÃO INVERTIDO";
const subtitle = params.get("subtitle") || "Tempo a acabar…";

document.getElementById("title").textContent = title;
document.getElementById("subtitle").textContent = subtitle;

const elTime = document.getElementById("time");
const elFill = document.getElementById("fill");
const elStatus = document.getElementById("statusPill");
const btnRestart = document.getElementById("btnRestart");
const btnPause = document.getElementById("btnPause");

let total = minutes * 60;
let remaining = total;
let running = true;
let lastTick = performance.now();

function pad(n){ return String(n).padStart(2,"0"); }

function render(){
  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  elTime.textContent = `${pad(m)}:${pad(s)}`;

  const pct = total > 0 ? (remaining / total) : 0;
  elFill.style.width = `${Math.max(0, Math.min(1, pct)) * 100}%`;

  if (remaining <= 0){
    elStatus.textContent = "TERMINOU";
    btnPause.textContent = "Pausar";
  } else {
    elStatus.textContent = running ? "A correr" : "Pausado";
    btnPause.textContent = running ? "Pausar" : "Retomar";
  }
}

function loop(now){
  const dt = (now - lastTick) / 1000;
  lastTick = now;

  if (running && remaining > 0){
    remaining -= dt;
    if (remaining < 0) remaining = 0;
  }

  // render mais “vivo” mas leve
  render();
  requestAnimationFrame(loop);
}

btnRestart.addEventListener("click", () => {
  remaining = total;
  running = true;
  lastTick = performance.now();
  render();
});

btnPause.addEventListener("click", () => {
  if (remaining <= 0) return;
  running = !running;
  lastTick = performance.now();
  render();
});

render();
requestAnimationFrame(loop);
