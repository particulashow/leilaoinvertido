const params = new URLSearchParams(location.search);

/**
 * Overlay Timer 60min (leilão invertido)
 * Query params:
 * - duration=60         (minutos)
 * - title=LEILAO...
 * - subtitle=...
 * - start=iso|ms        (ancorado num início fixo)
 *    Ex: start=2026-01-27T13:00:00+00:00
 *    ou start=1737982800000 (epoch ms)
 * - end=iso|ms          (alternativa: ancorar no fim)
 * - urgent=5            (minutos para modo urgência)
 * - danger=1            (minutos para modo perigo)
 */

const DEFAULT_MIN = 60;

const $hud = document.getElementById("hud");
const $title = document.getElementById("title");
const $subtitle = document.getElementById("subtitle");
const $digits = document.getElementById("digits");
const $micro = document.getElementById("micro");
const $progress = document.getElementById("progress");
const $statusText = document.getElementById("statusText");
const $flash = document.getElementById("flash");

const CIRC = 578; // stroke-dasharray
const durationMin = clampInt(params.get("duration"), 1, 24 * 60) ?? DEFAULT_MIN;
const totalMs = durationMin * 60 * 1000;

const urgentMin = clampInt(params.get("urgent"), 0, 60) ?? 5;
const dangerMin = clampInt(params.get("danger"), 0, 60) ?? 1;

$title.textContent = (params.get("title") || "LEILÃO INVERTIDO").toUpperCase();
$subtitle.textContent = params.get("subtitle") || "Termina quando chegar a zero";

let startMs = parseTimeParam(params.get("start"));
let endMs   = parseTimeParam(params.get("end"));

/**
 * Se vier "end", calculamos start = end - total
 * Se vier "start", usamos start e end = start + total
 * Se não vier nada, start = agora (quando abre)
 */
if (endMs && !startMs) startMs = endMs - totalMs;
if (startMs && !endMs) endMs = startMs + totalMs;
if (!startMs && !endMs){
  startMs = Date.now();
  endMs = startMs + totalMs;
  $micro.textContent = "Começa assim que abres o link";
} else {
  $micro.textContent = "Timer ancorado (mesmo tempo em todos os dispositivos)";
}

function tick(){
  const now = Date.now();
  let remaining = endMs - now;

  if (remaining < 0) remaining = 0;
  if (remaining > totalMs) remaining = totalMs;

  const mm = Math.floor(remaining / 60000);
  const ss = Math.floor((remaining % 60000) / 1000);

  $digits.textContent = `${String(mm).padStart(2,"0")}:${String(ss).padStart(2,"0")}`;

  // progresso (0% no início -> 100% no fim)
  const elapsed = totalMs - remaining;
  const p = elapsed / totalMs; // 0..1
  const offset = CIRC * (1 - p);
  $progress.style.strokeDashoffset = String(offset);

  // modos visuais
  const remMin = remaining / 60000;

  $hud.classList.toggle("urgent", remMin <= urgentMin && remMin > dangerMin);
  $hud.classList.toggle("danger", remMin <= dangerMin);

  if (remaining === 0){
    $statusText.textContent = "TERMINOU";
    $flash.classList.add("on");
  } else {
    $statusText.textContent = "AO VIVO";
    $flash.classList.remove("on");
  }
}

function parseTimeParam(v){
  if (!v) return null;
  const s = String(v).trim();
  if (!s) return null;

  // epoch ms
  if (/^\d{10,13}$/.test(s)){
    const n = Number(s);
    return (String(n).length === 10) ? (n * 1000) : n;
  }

  // ISO date
  const d = new Date(s);
  if (!isNaN(d.getTime())) return d.getTime();

  return null;
}

function clampInt(v, min, max){
  if (v === null || v === undefined) return null;
  const n = parseInt(String(v), 10);
  if (isNaN(n)) return null;
  return Math.min(max, Math.max(min, n));
}

// start
tick();
setInterval(tick, 250); // mais “snappy” (e o ring fica mais vivo)
