import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DEFAULT_STYLE, getStyleColors, isValidStyle } from "@/lib/styles";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { DashboardNav } from "@/components/layout/DashboardNav";
import { TimezoneSync } from "@/components/TimezoneSync";

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

  const styleId = isValidStyle(user.theme) ? user.theme : DEFAULT_STYLE;
  // Cor "ambiente" do estilo fora da tela do timer (cabeçalho, histórico) —
  // usa a cor de foco como representante; a página do timer sobrescreve
  // isso com a cor da fase atual (ver PomodoroTimer.tsx).
  const ambientColors = getStyleColors(styleId, "FOCUS");

  return (
    <div
      style={
        {
          "--accent-from": ambientColors.from,
          "--accent-to": ambientColors.to,
        } as React.CSSProperties
      }
      className="flex flex-1 flex-col bg-[var(--background)]"
    >
      <TimezoneSync />

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
