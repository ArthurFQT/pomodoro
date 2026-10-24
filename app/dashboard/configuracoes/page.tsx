import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DEFAULT_COLOR_MODE, isValidColorMode } from "@/lib/color-mode";
import { DEFAULT_THEME, isValidTheme } from "@/lib/themes";
import { ColorModePicker } from "@/components/settings/ColorModePicker";
import { GeneralTab } from "@/components/settings/tabs/GeneralTab";
import { ThemePicker } from "@/components/settings/ThemePicker";
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
    },
  });

  if (!user) {
    return null;
  }

  const currentTheme = isValidTheme(user.theme) ? user.theme : DEFAULT_THEME;
  const currentColorMode = isValidColorMode(user.colorMode)
    ? user.colorMode
    : DEFAULT_COLOR_MODE;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-10">
      <h1 className="bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
        Configurações
      </h1>

      <Tabs
        items={[
          { id: "geral", label: "Geral", content: <GeneralTab initialSettings={user} /> },
          {
            id: "aparencia",
            label: "Aparência",
            content: (
              <div className="flex flex-col gap-10">
                <ColorModePicker currentColorMode={currentColorMode} />
                <ThemePicker currentTheme={currentTheme} />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
