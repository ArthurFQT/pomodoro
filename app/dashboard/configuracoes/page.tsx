import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/settings/SettingsForm";

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

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <h1 className="bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
        Configurações
      </h1>

      <SettingsForm initialSettings={user} />
    </div>
  );
}
