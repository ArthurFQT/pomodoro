"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type FlowstateContextValue = {
  isFlowstate: boolean;
  setIsFlowstate: (value: boolean) => void;
};

const FlowstateContext = createContext<FlowstateContextValue | null>(null);

/** Estado compartilhado entre o PomodoroTimer (que sabe quando um foco está
 * rodando) e o cabeçalho do dashboard (que decide se deve se esconder) —
 * os dois vivem em partes diferentes da árvore, conectados só por
 * `{children}` no layout, daí o contexto em vez de prop drilling. */
export function FlowstateProvider({ children }: { children: ReactNode }) {
  const [isFlowstate, setIsFlowstate] = useState(false);

  return (
    <FlowstateContext.Provider value={{ isFlowstate, setIsFlowstate }}>
      {children}
    </FlowstateContext.Provider>
  );
}

export function useFlowstate(): FlowstateContextValue {
  const context = useContext(FlowstateContext);
  if (!context) {
    throw new Error("useFlowstate precisa estar dentro de um FlowstateProvider");
  }
  return context;
}
