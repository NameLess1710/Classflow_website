import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { cn } from "@/utils/class-names";

export function SectionCard({
  title,
  icon: Icon,
  linkTo,
  linkLabel = "View all",
  children,
  className,
  action,
}) {
  return (
    <section className={cn("flex min-w-0 flex-col rounded-2xl border bg-card shadow-soft", className)}>
      <header className="flex items-center justify-between gap-3 border-b px-5 py-4">
        <h2 className="flex items-center gap-2 text-base font-semibold">
          {Icon && <Icon className="h-4 w-4 text-cyan" />}
          {title}
        </h2>
        {action}
        {linkTo && (
          <Link
            to={linkTo}
            className="inline-flex items-center gap-1 rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {linkLabel} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </header>
      <div className="flex-1 p-5">{children}</div>
    </section>
  );
}
