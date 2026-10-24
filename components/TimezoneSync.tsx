"use client";

import { useEffect } from "react";

import { TIMEZONE_COOKIE } from "@/lib/timezone";

/** Detecta o fuso horário do navegador e guarda num cookie, pra que o
 * servidor (histórico/heatmap/streak) possa agrupar os ciclos por dia civil
 * local em vez de UTC. Não renderiza nada — só sincroniza o cookie. */
export function TimezoneSync() {
  useEffect(() => {
    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const current = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${TIMEZONE_COOKIE}=`))
        ?.split("=")[1];

      if (current !== timeZone) {
        document.cookie = `${TIMEZONE_COOKIE}=${timeZone}; path=/; max-age=31536000; samesite=lax`;
      }
    } catch {
      // Intl indisponível — servidor segue com o fuso padrão (UTC).
    }
  }, []);

  return null;
}
