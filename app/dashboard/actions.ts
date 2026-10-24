"use server";

import type { CycleType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/auth";
import { isValidColorMode } from "@/lib/color-mode";
import { isValidAlarmSound, isValidAmbientNoise } from "@/lib/sound";
import { isValidStyle } from "@/lib/styles";
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

// O campo no banco continua se chamando "theme" por simplicidade de
// migração — o conceito virou "estilo" (ver lib/styles.ts), só o nome da
// coluna ficou pra trás.
export async function setStyle(styleId: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId || !isValidStyle(styleId)) {
    return;
  }

  await prisma.user.update({
    where: { id: userId },
    data: { theme: styleId },
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

const soundSettingsSchema = z.object({
  alarmSound: z.string().refine(isValidAlarmSound, "Som inválido."),
  soundVolume: z.coerce.number().int().min(0).max(100),
  ambientNoise: z.string().refine(isValidAmbientNoise, "Ruído inválido."),
});

export type SoundSettingsFormState = { ok: boolean; message: string } | undefined;

export async function updateSoundSettings(
  _prevState: SoundSettingsFormState,
  formData: FormData,
): Promise<SoundSettingsFormState> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { ok: false, message: "Você precisa estar logado." };
  }

  const parsed = soundSettingsSchema.safeParse({
    alarmSound: formData.get("alarmSound"),
    soundVolume: formData.get("soundVolume"),
    ambientNoise: formData.get("ambientNoise"),
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

  return { ok: true, message: "Configurações de som salvas." };
}
