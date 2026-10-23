import { BuildProgress } from "@/components/BuildProgress";
import { GearIcon } from "@/components/GearIcon";
import { TomatoBuilder } from "@/components/TomatoBuilder";

export default function Home() {
  return (
    <section className="blueprint-grid relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      <div className="ribbon">EM CONSTRUÇÃO</div>

      <GearIcon className="animate-gear-slow pointer-events-none absolute -top-10 -left-10 h-40 w-40 text-amber-400/25" />
      <GearIcon className="animate-gear-reverse pointer-events-none absolute -right-14 bottom-6 h-56 w-56 text-red-400/15" />

      <main className="relative z-10 flex flex-col items-center gap-10 px-6 py-20 text-center">
        <div className="animate-float-slow h-52 w-52">
          <TomatoBuilder />
        </div>

        <div className="flex flex-col items-center gap-3">
          <h1 className="bg-gradient-to-br from-red-600 to-orange-500 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl">
            Pomodoro
          </h1>
          <p className="flex items-center gap-2 text-lg text-zinc-600 dark:text-zinc-400">
            <span className="animate-blink-light h-3 w-3 rounded-full bg-orange-500" />
            Estamos construindo algo delicioso
          </p>
        </div>

        <BuildProgress />
      </main>
    </section>
  );
}
