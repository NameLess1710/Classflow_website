import { cn } from "@/utils/class-names";

const tones = {
  primary: "bg-primary/15 text-primary",
  cyan: "bg-cyan/15 text-cyan",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  destructive: "bg-destructive/15 text-destructive",
};

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "primary",
}) {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-soft sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span className={cn("inline-flex h-9 w-9 items-center justify-center rounded-lg", tones[tone])}>
          <Icon className="h-[18px] w-[18px]" />
        </span>
      </div>
      <p className="mt-2 font-display text-2xl font-semibold text-foreground">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
