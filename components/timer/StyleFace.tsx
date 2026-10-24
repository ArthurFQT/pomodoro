import type { StyleId } from "@/lib/styles";

import { LofiStyle } from "./styles/LofiStyle";
import { MinimalStyle } from "./styles/MinimalStyle";
import { PastelStyle } from "./styles/PastelStyle";
import { RetroStyle } from "./styles/RetroStyle";
import type { StyleFaceProps } from "./styles/types";

const FACES: Record<StyleId, (props: StyleFaceProps) => React.JSX.Element> = {
  minimal: MinimalStyle,
  pastel: PastelStyle,
  lofi: LofiStyle,
  retro: RetroStyle,
};

type Props = StyleFaceProps & { styleId: StyleId };

export function StyleFace({ styleId, ...props }: Props) {
  const Face = FACES[styleId];
  return <Face {...props} />;
}
