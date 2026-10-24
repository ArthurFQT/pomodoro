export type AlarmSound = "bell" | "soft" | "classic" | "digital";
export type AmbientNoise = "none" | "white" | "pink" | "rain" | "forest" | "space";

export const ALARM_SOUNDS: { id: AlarmSound; label: string }[] = [
  { id: "bell", label: "Sino" },
  { id: "soft", label: "Suave" },
  { id: "classic", label: "Clássico" },
  { id: "digital", label: "Digital" },
];

export const AMBIENT_NOISES: { id: AmbientNoise; label: string }[] = [
  { id: "none", label: "Nenhum" },
  { id: "white", label: "Ruído branco" },
  { id: "pink", label: "Ruído rosa" },
  { id: "rain", label: "Chuva" },
  { id: "forest", label: "Floresta" },
  { id: "space", label: "Espaço" },
];

export const DEFAULT_ALARM_SOUND: AlarmSound = "bell";
export const DEFAULT_AMBIENT_NOISE: AmbientNoise = "none";
export const DEFAULT_SOUND_VOLUME = 70;

export function isValidAlarmSound(value: string): value is AlarmSound {
  return ALARM_SOUNDS.some((sound) => sound.id === value);
}

export function isValidAmbientNoise(value: string): value is AmbientNoise {
  return AMBIENT_NOISES.some((noise) => noise.id === value);
}
