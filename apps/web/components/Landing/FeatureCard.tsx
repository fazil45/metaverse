export default function FeatureCard({
  className = "",
  icon,
  title,
  children,
}: {
  className?: string;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article
      className={`relative overflow-hidden rounded-[1.15rem] border border-border bg-card p-6 shadow-xl/10 transition hover:-translate-y-1 hover:border-cyan-300/70 ${className}`}
    >
      <div className="grid size-9 place-items-center rounded-[10px] border border-cyan-300/60 bg-cyan-300/10 text-primary">
        {icon}
      </div>
      <h3 className="mt-4 text-[17px] font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        {children}
      </p>
    </article>
  );
}