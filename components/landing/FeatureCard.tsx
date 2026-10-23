type FeatureCardProps = {
  icon: string;
  title: string;
  description: string;
};

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
      <span className="text-3xl">{icon}</span>
      <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">{title}</h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
    </div>
  );
}
