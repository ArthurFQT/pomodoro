"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

declare global {
  interface Window {
    documentPictureInPicture?: {
      requestWindow: (options?: { width?: number; height?: number }) => Promise<Window>;
      window: Window | null;
    };
  }
}

type PictureInPictureProps = {
  label: string;
  time: string;
  colorTo: string;
  isRunning: boolean;
  onToggle: () => void;
};

function PipIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <rect x="12" y="11" width="7" height="5" rx="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Mostra o timer numa janelinha flutuante (Document Picture-in-Picture),
 * pra acompanhar enquanto usa outras abas/janelas. Só renderiza o botão em
 * navegadores com suporte — a API ainda não é universal. */
export function PictureInPicture({ label, time, colorTo, isRunning, onToggle }: PictureInPictureProps) {
  const [pipWindow, setPipWindow] = useState<Window | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  // Detecção de suporte client-only — sem valor vindo do servidor pra
  // divergir.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsSupported(typeof window !== "undefined" && "documentPictureInPicture" in window);
  }, []);

  useEffect(() => {
    if (!pipWindow) return;
    function handlePageHide() {
      setPipWindow(null);
    }
    pipWindow.addEventListener("pagehide", handlePageHide);
    return () => pipWindow.removeEventListener("pagehide", handlePageHide);
  }, [pipWindow]);

  async function openPip() {
    if (!window.documentPictureInPicture) return;
    try {
      const pip = await window.documentPictureInPicture.requestWindow({
        width: 240,
        height: 200,
      });
      pip.document.body.style.margin = "0";
      setPipWindow(pip);
    } catch {
      // Usuário cancelou o prompt do navegador, ou a API falhou — segue sem PiP.
    }
  }

  function closePip() {
    pipWindow?.close();
    setPipWindow(null);
  }

  if (!isSupported) return null;

  return (
    <>
      <button
        type="button"
        onClick={pipWindow ? closePip : openPip}
        aria-label={pipWindow ? "Fechar picture-in-picture" : "Picture-in-picture"}
        title="Picture-in-picture"
        className="absolute top-4 right-16 rounded-full border border-zinc-300 p-2 text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-900"
      >
        <PipIcon />
      </button>

      {pipWindow &&
        createPortal(
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              height: "100vh",
              fontFamily: "system-ui, -apple-system, sans-serif",
              background: "#09090b",
              color: "#fafafa",
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: "#a1a1aa",
              }}
            >
              {label}
            </span>
            <span
              style={{
                fontSize: 48,
                fontWeight: 700,
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1,
              }}
            >
              {time}
            </span>
            <button
              type="button"
              onClick={onToggle}
              style={{
                border: "none",
                borderRadius: 999,
                padding: "8px 20px",
                fontSize: 14,
                fontWeight: 600,
                color: "white",
                background: colorTo,
                cursor: "pointer",
              }}
            >
              {isRunning ? "Pausar" : "Começar"}
            </button>
          </div>,
          pipWindow.document.body,
        )}
    </>
  );
}
