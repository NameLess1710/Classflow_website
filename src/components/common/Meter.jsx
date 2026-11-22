import { cn } from "@/utils/class-names";

/** Horizontal progress meter with an optional threshold marker (e.g. 75% attendance). */
export function Meter({
  value,
  max = 100,
  tone = "primary",
  marker,
  className,
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const bar = {
    primary: "bg-gradient-primary",
    cyan: "bg-cyan",
    success: "bg-success",
    warning: "bg-warning",
    destructive: "bg-destructive",
  }[tone];
  return (
    <div className={cn("relative h-2 w-full overflow-visible rounded-full bg-muted", className)}>
      <div className={cn("h-full rounded-full transition-all", bar)} style={{ width: `${pct}%` }} />
      {marker !== undefined && (
        <span
          className="absolute -top-1 h-4 w-0.5 rounded bg-foreground/70"
          style={{ left: `${Math.min(100, (marker / max) * 100)}%` }}
          aria-hidden
        />
      )}
    </div>
  );
}
