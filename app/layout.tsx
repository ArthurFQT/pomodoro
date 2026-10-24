import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

import { auth } from "@/auth";
import {
  COLOR_MODE_CLASS,
  DEFAULT_COLOR_MODE,
  isValidColorMode,
  type ColorMode,
} from "@/lib/color-mode";
import { prisma } from "@/lib/prisma";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pomodoro",
  description: "Aplicativo de timer Pomodoro",
};

// Lê a sessão pra resolver o modo de cor do usuário — não pode ser
// pré-renderizado estaticamente.
export const instant = false;

async function resolveColorMode(): Promise<ColorMode> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return DEFAULT_COLOR_MODE;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { colorMode: true },
  });

  return user && isValidColorMode(user.colorMode)
    ? user.colorMode
    : DEFAULT_COLOR_MODE;
}

// Só entra em ação no modo "Automático": decide claro/escuro a partir da
// preferência do sistema operacional antes da primeira pintura. Nos outros
// modos a classe já vem certa do servidor (ver COLOR_MODE_CLASS), sem risco
// de flash.
const ANTI_FLASH_SCRIPT = `
(function () {
  try {
    if (document.documentElement.getAttribute("data-color-mode") === "system") {
      var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) document.documentElement.classList.add("dark");
    }
  } catch (e) {}
})();
`;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const colorMode = await resolveColorMode();

  const htmlClassName = [
    geistSans.variable,
    geistMono.variable,
    COLOR_MODE_CLASS[colorMode],
    "h-full",
    "antialiased",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <html
      lang="en"
      data-color-mode={colorMode}
      className={htmlClassName}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Script id="color-mode-init" strategy="beforeInteractive">
          {ANTI_FLASH_SCRIPT}
        </Script>
        {children}
      </body>
    </html>
  );
}
