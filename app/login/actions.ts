"use server";

import { AuthError } from "next-auth";

import { signIn } from "@/auth";

export async function loginWithCredentials(
  _prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return "E-mail ou senha incorretos.";
    }
    throw error;
  }
}

export async function loginWithGoogle() {
  await signIn("google", { redirectTo: "/dashboard" });
}

export async function loginWithGitHub() {
  await signIn("github", { redirectTo: "/dashboard" });
}
