const STEPS = [
  {
    title: "Crie sua conta",
    description: "Com Google, GitHub ou e-mail e senha — leva menos de um minuto.",
  },
  {
    title: "Escolha um estilo",
    description: "Quatro formatos de timer, com cor que muda por fase.",
  },
  {
    title: "Comece a focar",
    description: "25 minutos de foco, pausas no meio, e cada ciclo fica no seu histórico.",
  },
] as const;

export function HowItWorks() {
  return (
    <div className="grid gap-8 py-16 sm:grid-cols-3">
      {STEPS.map((step, index) => (
        <div key={step.title} className="flex flex-col gap-2">
          <span className="bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] bg-clip-text text-3xl font-bold text-transparent">
            {index + 1}
          </span>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
            {step.title}
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {step.description}
          </p>
        </div>
      ))}
    </div>
  );
}
