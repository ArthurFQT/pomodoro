import { PomodoroTimer } from "@/components/timer/PomodoroTimer";

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <PomodoroTimer />
    </div>
  );
}
