import { auth } from "@/auth";
import { DEFAULT_COLOR_MODE, isValidColorMode } from "@/lib/color-mode";
import type { PomodoroSettings } from "@/lib/pomodoro";
import { prisma } from "@/lib/prisma";
import {
  DEFAULT_ALARM_SOUND,
  DEFAULT_AMBIENT_NOISE,
  isValidAlarmSound,
  isValidAmbientNoise,
} from "@/lib/sound";
import { DEFAULT_STYLE, isValidStyle } from "@/lib/styles";
import { ColorModePicker } from "@/components/settings/ColorModePicker";
import { GeneralTab } from "@/components/settings/tabs/GeneralTab";
import { SoundsTab } from "@/components/settings/tabs/SoundsTab";
import { StylePicker } from "@/components/settings/StylePicker";
import { Tabs } from "@/components/ui/Tabs";

// A sessão e as configurações são lidas a cada requisição — não pode ser
// pré-renderizado estaticamente.
export const instant = false;

export default async function ConfiguracoesPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      theme: true,
      focusMinutes: true,
      shortBreakMinutes: true,
      longBreakMinutes: true,
      longBreakInterval: true,
      soundEnabled: true,
      notificationsEnabled: true,
      autoStartBreaks: true,
      colorMode: true,
      alarmSound: true,
      soundVolume: true,
      ambientNoise: true,
    },
  });

  if (!user) {
    return null;
  }

  const currentStyle = isValidStyle(user.theme) ? user.theme : DEFAULT_STYLE;
  const currentColorMode = isValidColorMode(user.colorMode)
    ? user.colorMode
    : DEFAULT_COLOR_MODE;
  const settings: PomodoroSettings = {
    ...user,
    alarmSound: isValidAlarmSound(user.alarmSound) ? user.alarmSound : DEFAULT_ALARM_SOUND,
    ambientNoise: isValidAmbientNoise(user.ambientNoise)
      ? user.ambientNoise
      : DEFAULT_AMBIENT_NOISE,
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-10">
      <h1 className="bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
        Configurações
      </h1>

      <Tabs
        items={[
          { id: "geral", label: "Geral", content: <GeneralTab initialSettings={settings} /> },
          {
            id: "aparencia",
            label: "Aparência",
            content: (
              <div className="flex flex-col gap-10">
                <ColorModePicker currentColorMode={currentColorMode} />
                <StylePicker currentStyle={currentStyle} />
              </div>
            ),
          },
          {
            id: "sons",
            label: "Sons",
            content: (
              <SoundsTab
                initialAlarmSound={settings.alarmSound}
                initialSoundVolume={settings.soundVolume}
                initialAmbientNoise={settings.ambientNoise}
              />
            ),
          },
        ]}
      />
    </div>
  );
}
