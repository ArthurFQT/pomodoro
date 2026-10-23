"use server";

import type { CycleType } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
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
