import { FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

export function DemoBadge({ label = "Demo placeholder", className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-warning/40 bg-warning/10 px-2.5 py-0.5 text-xs font-semibold text-warning",
        className,
      )}
    >
      <FlaskConical className="h-3 w-3" /> {label}
    </span>
  );
}
