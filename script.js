const params = new URLSearchParams(location.search);

function safeText(v, fallback){
  const s = (v ?? "").toString().trim();
  return s ? s : fallback;
}

function parseIntSafe(v, fallback){
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : fallback;
}

function parseIsoDate(v){
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

const title = safeText(params.get("title"), "LEILÃO INVERTIDO");
const subtitle = safeText(params.get("subtitle"), "Faz a tua oferta agora");

const durationMin = parseIntSafe(params.get("duration"), 60);
const urgentMin = parseIntSafe(params.get("urgent"), 10);
const dangerMin = parseIntSafe(params.get("danger"), 2);

const accent = params.get("accent");
const text = params.get("text");

if (accent) document.documentElement.style.setProperty("--accent", accent);
if (text) document.documentElement.style.setProperty("--text", text);

document.getElementById("title").textContent = title;
document.getElementById("subtitle").textContent = subtitle;

const elTimer = document.getElementById("timer");
const elFill = document.getElementById("barFill");
const elStateText = document.getElementById("stateText");
const elTimerCard = document.getElementById("timerCard");
const elAnchorInfo = document.getElementById("anchorInfo");

const totalSeconds = Math.max(0, durationMin) * 60;

const start = parseIsoDate(params.get("start"));
const end = parseIsoDate(params.get("end"));

let anchorStart = null;
let anchorEnd = null;

// Regras:
// - Se existir "end", conta até end (end manda).
// - Senão, se existir "start", conta desde start + duration.
// - Senão, começa quando abre (start = now).
if (end){
  anchorEnd = end;
  anchorStart = new Date(end.getTime() - totalSeconds * 1000);
  elAnchorInfo.textContent = "Ancorado por hora de fim";
} else if (start){
  anchorStart = start;
  anchorEnd = new Date(start.getTime() + totalSeconds * 1000);
  elAnchorInfo.textContent = "Ancorado por hora de início";
} else {
  anchorStart = new Date();
  anchorEnd = new Date(anchorStart.getTime() + totalSeconds * 1000);
  elAnchorInfo.textContent = "Início ao abrir a página";
}

function pad2(n){ return String(n).padStart(2, "0"); }

function formatMMSS(sec){
  sec = Math.max(0, Math.floor(sec));
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${pad2(m)}:${pad2(s)}`;
}

function setState(state){
  elTimerCard.classList.toggle("is-urgent", state === "urgent");
  elTimerCard.classList.toggle("is-danger", state === "danger");

  if (state === "danger") elStateText.textContent = "ÚLTIMOS MINUTOS";
  else if (state === "urgent") elStateText.textContent = "A ACABAR";
  else elStateText.textContent = "A DECORRER";
}

function tick(){
  const now = new Date();
  const remaining = (anchorEnd.getTime() - now.getTime()) / 1000;

  elTimer.textContent = formatMMSS(remaining);

  const progress = 1 - (remaining / (totalSeconds || 1));
  const pct = Math.max(0, Math.min(1, progress)) * 100;
  elFill.style.width = `${pct}%`;

  // estados visuais
  const remMin = remaining / 60;
  if (remaining <= 0){
    setState("danger");
    elStateText.textContent = "TERMINOU";
    elFill.style.width = "100%";
  } else if (remMin <= dangerMin){
    setState("danger");
  } else if (remMin <= urgentMin){
    setState("urgent");
  } else {
    setState("normal");
  }
}

// mais fluido e “sem drift”
tick();
setInterval(tick, 250);
