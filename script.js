let totalSeconds = 60 * 60; // 60 minutos
const timerEl = document.getElementById("auctionTimer");
const progressFill = document.getElementById("progressFill");

const totalInitial = totalSeconds;

function updateAuctionTimer() {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;

  timerEl.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;

  // PROGRESS BAR
  const pct = (totalSeconds / totalInitial) * 100;
  progressFill.style.width = pct + "%";

  // CORES PROGRESSIVAS
  if (totalSeconds > 45 * 60) {
    timerEl.style.color = "#15803d"; // verde
  } else if (totalSeconds > 30 * 60) {
    timerEl.style.color = "#b59a00"; // amarelo
  } else if (totalSeconds > 15 * 60) {
    timerEl.style.color = "#ea580c"; // laranja
  } else if (totalSeconds > 60) {
    timerEl.style.color = "#b91c1c"; // vermelho
  } else {
    timerEl.style.color = "#dc2626"; // vermelho forte
    timerEl.classList.add("blink");
  }

  // TERMINOU
  if (totalSeconds <= 0) {
    timerEl.textContent = "TERMINADO";
    timerEl.style.color = "#dc2626";
    timerEl.classList.add("blink");
    clearInterval(countdownInterval);
  }

  totalSeconds--;
}

const countdownInterval = setInterval(updateAuctionTimer, 1000);
updateAuctionTimer();
