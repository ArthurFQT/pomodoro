"use client";

import type { ReactNode } from "react";

import { useFlowstate } from "./FlowstateProvider";

/** Some sozinho assim que um foco começa a rodar, volta ao normal ao
 * pausar/pular/concluir — "modo flowstate": menos distração visual sem
 * precisar entrar na tela cheia manualmente. */
export function FlowstateHeader({ children }: { children: ReactNode }) {
  const { isFlowstate } = useFlowstate();

  return (
    <header
      hidden={isFlowstate}
      className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 transition-opacity"
    >
      {children}
    </header>
  );
}
