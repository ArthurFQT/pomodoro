"use client";

const FAVICON_SIZE = 32;

function getFaviconLink(): HTMLLinkElement {
  let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  return link;
}

/** Desenha um favicon de "pizza" mostrando o progresso restante do timer,
 * na cor da fase atual — só enquanto uma sessão está em andamento. */
export function updateProgressFavicon(progress: number, color: string) {
  if (typeof document === "undefined") return;

  const canvas = document.createElement("canvas");
  canvas.width = FAVICON_SIZE;
  canvas.height = FAVICON_SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const clamped = Math.min(1, Math.max(0, progress));
  const center = FAVICON_SIZE / 2;
  const radius = FAVICON_SIZE / 2 - 2;

  ctx.clearRect(0, 0, FAVICON_SIZE, FAVICON_SIZE);

  ctx.beginPath();
  ctx.arc(center, center, radius, 0, Math.PI * 2);
  ctx.fillStyle = "#e4e4e7";
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(center, center);
  ctx.arc(center, center, radius, -Math.PI / 2, -Math.PI / 2 + clamped * Math.PI * 2);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();

  getFaviconLink().href = canvas.toDataURL("image/png");
}

/** Volta pro favicon padrão do app (fora de uma sessão de timer). */
export function resetFavicon() {
  if (typeof document === "undefined") return;
  getFaviconLink().href = "/favicon.ico";
}
