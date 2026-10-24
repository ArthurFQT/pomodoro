import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
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

  const settings = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      focusMinutes: true,
      shortBreakMinutes: true,
      longBreakMinutes: true,
      longBreakInterval: true,
      soundEnabled: true,
      notificationsEnabled: true,
    },
  });

  if (!settings) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <PomodoroTimer userId={userId} settings={settings} />
    </div>
  );
}
