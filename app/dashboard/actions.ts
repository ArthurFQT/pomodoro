"use server";

import type { CycleType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/auth";
import { isValidColorMode } from "@/lib/color-mode";
import { isValidTheme } from "@/lib/themes";
import { prisma } from "@/lib/prisma";

export async function recordCycle(type: CycleType, durationMinutes: number) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return;
  }

  await prisma.cycle.create({
    data: { userId, type, durationMinutes },
  });
}

export async function setTheme(themeId: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId || !isValidTheme(themeId)) {
    return;
  }

  await prisma.user.update({
    where: { id: userId },
    data: { theme: themeId },
  });

  revalidatePath("/dashboard");
}

export async function setColorMode(colorMode: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId || !isValidColorMode(colorMode)) {
    return;
  }

  await prisma.user.update({
    where: { id: userId },
    data: { colorMode },
  });

  // O modo de cor é resolvido no layout raiz — afeta o app inteiro, não só
  // a área logada.
  revalidatePath("/", "layout");
}

const settingsSchema = z.object({
  focusMinutes: z.coerce.number().int().min(1).max(180),
  shortBreakMinutes: z.coerce.number().int().min(1).max(180),
  longBreakMinutes: z.coerce.number().int().min(1).max(180),
  longBreakInterval: z.coerce.number().int().min(1).max(12),
  soundEnabled: z.coerce.boolean(),
  notificationsEnabled: z.coerce.boolean(),
  autoStartBreaks: z.coerce.boolean(),
});

export type SettingsFormState = { ok: boolean; message: string } | undefined;

export async function updateSettings(
  _prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { ok: false, message: "Você precisa estar logado." };
  }

  const parsed = settingsSchema.safeParse({
    focusMinutes: formData.get("focusMinutes"),
    shortBreakMinutes: formData.get("shortBreakMinutes"),
    longBreakMinutes: formData.get("longBreakMinutes"),
    longBreakInterval: formData.get("longBreakInterval"),
    soundEnabled: formData.get("soundEnabled"),
    notificationsEnabled: formData.get("notificationsEnabled"),
    autoStartBreaks: formData.get("autoStartBreaks"),
  });

  if (!parsed.success) {
    return { ok: false, message: "Verifique os valores informados." };
  }

  await prisma.user.update({
    where: { id: userId },
    data: parsed.data,
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/configuracoes");

  return { ok: true, message: "Configurações salvas." };
}
