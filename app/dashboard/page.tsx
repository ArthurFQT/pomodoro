import { auth } from "@/auth";
import { PomodoroTimer } from "@/components/timer/PomodoroTimer";

// A sessão é lida por requisição (cookies) — não pode ser pré-renderizado.
export const instant = false;

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <PomodoroTimer userId={userId} />
    </div>
  );
}
