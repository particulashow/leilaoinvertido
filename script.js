// LINK VIA URL
const params = new URLSearchParams(window.location.search);
const linkParam = params.get("link");

if (linkParam) {
  document.getElementById("auctionLink").textContent = linkParam;
}

// COUNTDOWN
let totalSeconds = 60 * 60; // 60 minutos
const timerEl = document.getElementById("auctionTimer");

function updateAuctionTimer() {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;

  timerEl.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;

  // CORES PROGRESSIVAS
  let color = "#00ff88";

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
