import { Link } from "@tanstack/react-router";
import { NAV_ITEMS } from "@/data/nav";

export function QuickAccess() {
  return (
    <section aria-labelledby="quick-access">
      <h2 id="quick-access" className="mb-3 text-base font-semibold">
        Quick access
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {NAV_ITEMS.filter((i) => i.to !== "/dashboard").map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="group flex flex-col gap-3 rounded-2xl border bg-card p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/50"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary transition-colors group-hover:bg-gradient-primary group-hover:text-primary-foreground">
              <item.icon className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-foreground">{item.label}</span>
              <span className="block text-xs text-muted-foreground">{item.description}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
