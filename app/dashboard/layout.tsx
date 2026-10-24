import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DEFAULT_THEME, isValidTheme } from "@/lib/themes";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { DashboardNav } from "@/components/layout/DashboardNav";

// Lê a sessão e o tema do usuário a cada requisição — não pode ser
// pré-renderizado estaticamente.
export const instant = false;

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { theme: true },
  });

  if (!user) {
    // Defesa extra: o callback session() em auth.ts já invalida sessões
    // cujo usuário não existe mais no banco (userId viraria undefined
    // acima), mas cobre também uma eventual condição de corrida entre
    // as duas consultas.
    redirect("/login");
  }

  const theme = isValidTheme(user.theme) ? user.theme : DEFAULT_THEME;

  return (
    <div data-theme={theme} className="flex flex-1 flex-col bg-[var(--background)]">
      <header className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-6">
          <span className="bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] bg-clip-text text-lg font-extrabold tracking-tight text-transparent">
            🍅 Pomodoro
          </span>
          <DashboardNav />
        </div>

        <div className="flex items-center gap-4">
          <SignOutButton />
        </div>
      </header>

      <main className="flex flex-1 flex-col px-6 py-12">{children}</main>
    </div>
  );
}
