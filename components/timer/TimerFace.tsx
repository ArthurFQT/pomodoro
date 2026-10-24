import type { ThemeId } from "@/lib/themes";

import { BerryFace } from "./faces/BerryFace";
import { CitrusFace } from "./faces/CitrusFace";
import { ForestFace } from "./faces/ForestFace";
import { NataFace } from "./faces/NataFace";
import { OceanFace } from "./faces/OceanFace";
import { SoftFace } from "./faces/SoftFace";
import { TomatoFace } from "./faces/TomatoFace";
import type { TimerFaceProps } from "./faces/types";

const FACES: Record<ThemeId, (props: TimerFaceProps) => React.JSX.Element> = {
  tomato: TomatoFace,
  citrus: CitrusFace,
  berry: BerryFace,
  ocean: OceanFace,
  forest: ForestFace,
  soft: SoftFace,
  nata: NataFace,
};

type Props = TimerFaceProps & { themeId: ThemeId };

export function TimerFace({ themeId, ...props }: Props) {
  const Face = FACES[themeId];
  return <Face {...props} />;
}
