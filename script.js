let totalSeconds = 60 * 60; // 60 minutos
const timerEl = document.getElementById("auctionTimer");

function updateAuctionTimer() {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;

  timerEl.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;

  // MUDANÇA DE CORES PROGRESSIVA
  if (totalSeconds > 45 * 60) {
    timerEl.style.color = "#00ff88"; // verde
  } else if (totalSeconds > 30 * 60) {
    timerEl.style.color = "#ccff00"; // amarelo
  } else if (totalSeconds > 15 * 60) {
    timerEl.style.color = "#ff8800"; // laranja
  } else if (totalSeconds > 60) {
    timerEl.style.color = "#ff3300"; // vermelho
  } else {
    timerEl.style.color = "#ff0000"; // vermelho forte
    timerEl.classList.add("blink"); // últimos 60s piscam
  }

  // TERMINOU
  if (totalSeconds <= 0) {
    timerEl.textContent = "TERMINADO";
    timerEl.style.color = "#ff0000";
    timerEl.classList.add("blink");
    clearInterval(countdownInterval);
  }

  totalSeconds--;
}

const countdownInterval = setInterval(updateAuctionTimer, 1000);
updateAuctionTimer();
