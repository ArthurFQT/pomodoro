import { auth } from "@/auth";
import type { PomodoroSettings } from "@/lib/pomodoro";
import { prisma } from "@/lib/prisma";
import {
  DEFAULT_ALARM_SOUND,
  DEFAULT_AMBIENT_NOISE,
  isValidAlarmSound,
  isValidAmbientNoise,
} from "@/lib/sound";
import { DEFAULT_STYLE, isValidStyle } from "@/lib/styles";
import { PomodoroTimer } from "@/components/timer/PomodoroTimer";

// A sessão e as configurações são lidas a cada requisição — não pode ser
// pré-renderizado estaticamente.
export const instant = false;

export default async function DashboardPage() {
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
      alarmSound: true,
      soundVolume: true,
      ambientNoise: true,
    },
  });

  if (!user) {
    return null;
  }

  const styleId = isValidStyle(user.theme) ? user.theme : DEFAULT_STYLE;
  const settings: PomodoroSettings = {
    ...user,
    alarmSound: isValidAlarmSound(user.alarmSound) ? user.alarmSound : DEFAULT_ALARM_SOUND,
    ambientNoise: isValidAmbientNoise(user.ambientNoise)
      ? user.ambientNoise
      : DEFAULT_AMBIENT_NOISE,
  };

  return (
    <div className="timer-ambient-bg flex flex-1 flex-col items-center justify-center rounded-3xl">
      <PomodoroTimer userId={userId} settings={settings} styleId={styleId} />
    </div>
  );
}
