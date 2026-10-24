import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DEFAULT_THEME, isValidTheme } from "@/lib/themes";
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
    },
  });

  if (!user) {
    return null;
  }

  const themeId = isValidTheme(user.theme) ? user.theme : DEFAULT_THEME;

  return (
    <div className="timer-ambient-bg flex flex-1 flex-col items-center justify-center rounded-3xl">
      <PomodoroTimer userId={userId} settings={user} themeId={themeId} />
    </div>
  );
}
