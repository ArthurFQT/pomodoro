import { auth } from "@/auth";
import { SignOutButton } from "@/components/auth/SignOutButton";

// Página autenticada: a sessão é lida por requisição (cookies), então não
// pode ser pré-renderizada estaticamente.
export const instant = false;

export default async function DashboardPage() {
  const session = await auth();

  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-6 bg-zinc-50 px-6 py-20 text-center dark:bg-zinc-950">
      <div className="flex flex-col items-center gap-2">
        <h1 className="bg-gradient-to-br from-red-600 to-orange-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
          Bem-vindo(a)
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">{session?.user?.email}</p>
      </div>

      <p className="max-w-sm text-sm text-zinc-500 dark:text-zinc-500">
        O timer Pomodoro, os temas, o histórico, o heatmap e o streak chegam
        nas próximas etapas. Por enquanto, isto confirma que o login está
        funcionando.
      </p>

      <SignOutButton />
    </section>
  );
}
