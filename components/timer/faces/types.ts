import type { ReactNode } from "react";

export type TimerFaceProps = {
  /** 1 = início (tempo cheio), 0 = fim (tempo esgotado). */
  progress: number;
  /** true quando a etapa acabou de concluir — estado celebratório. */
  pulsing?: boolean;
  children: ReactNode;
};
