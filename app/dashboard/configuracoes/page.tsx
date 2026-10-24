import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DEFAULT_THEME, isValidTheme } from "@/lib/themes";
import { SettingsForm } from "@/components/settings/SettingsForm";
import { ThemePicker } from "@/components/settings/ThemePicker";

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
    },
  });

  if (!user) {
    return null;
  }

  const currentTheme = isValidTheme(user.theme) ? user.theme : DEFAULT_THEME;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-10">
      <h1 className="bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
        Configurações
      </h1>

      <ThemePicker currentTheme={currentTheme} />

      <SettingsForm initialSettings={user} />
    </div>
  );
}
