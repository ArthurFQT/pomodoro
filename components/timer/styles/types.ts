import type { ReactNode } from "react";

export type StyleFaceProps = {
  /** 1 = início (tempo cheio), 0 = fim (tempo esgotado). */
  progress: number;
  /** true quando a etapa acabou de concluir — estado celebratório. */
  pulsing?: boolean;
  /** Lado do bounding box em pixels. @default 280 */
  size?: number;
  children: ReactNode;
};

export const DEFAULT_STYLE_SIZE = 280;
