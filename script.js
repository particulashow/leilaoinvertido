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
  let color = "#00ff88"; // verde

  if (totalSeconds > 45 * 60) {
    color = "#00ff88";
  } else if (totalSeconds > 30 * 60) {
    color = "#ccff00";
  } else if (totalSeconds > 15 * 60) {
    color = "#ff8800";
  } else if (totalSeconds > 60) {
    color = "#ff3300";
  } else {
    color = "#ff0000";
    timerEl.classList.add("blink");
  }

  timerEl.style.color = color;
  progressFill.style.background = color;

  if (totalSeconds <= 0) {
    timerEl.textContent = "TERMINADO";
    timerEl.style.color = "#ff0000";
    progressFill.style.background = "#ff0000";
    timerEl.classList.add("blink");
    clearInterval(countdownInterval);
  }

  totalSeconds--;
}

const countdownInterval = setInterval(updateAuctionTimer, 1000);
updateAuctionTimer();
