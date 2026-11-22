import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Bell, CheckCheck, ChevronDown, Pin, Search, Star } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Chip } from "@/components/common/Chip";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sampleNotices } from "@/lib/sample-data";
import { readNoticesStore } from "@/lib/stores";
import { formatDate, relativeDayLabel } from "@/lib/dates";
import { noticeTone } from "@/lib/tones";
import { pageHead } from "@/lib/seo";
import type { NoticeCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_student/notices")({
  head: () => pageHead("Notices", "Official college announcements: exams, placements, events, hostel and library updates."),
  component: NoticesPage,
});

const CATEGORIES: ("All" | NoticeCategory)[] = ["All", "Academic", "Exam", "Placement", "Events", "Hostel", "Library"];

function NoticesPage() {
  const notices = useMemo(() => sampleNotices(), []);
  const [read, setRead] = readNoticesStore.useStore();
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = notices
    .filter((n) => category === "All" || n.category === category)
    .filter((n) => `${n.title} ${n.summary} ${n.from}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned) || b.date.localeCompare(a.date));

  const unread = notices.filter((n) => !read.includes(n.id)).length;

  const toggle = (id: string) => {
    setOpenId((cur) => (cur === id ? null : id));
    if (!read.includes(id)) setRead((r) => [...r, id]);
  };

  return (
    <div>
      <PageHeader
        title="Notices"
        description="Official announcements from your college. Tap a notice to read the full details."
        icon={Bell}
        actions={
          <Button variant="outline" onClick={() => setRead(notices.map((n) => n.id))} disabled={unread === 0}>
            <CheckCheck /> Mark all as read{unread > 0 ? ` (${unread})` : ""}
          </Button>
        }
      />

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative lg:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search notices…" value={query} onChange={(e) => setQuery(e.target.value)} className="h-10 pl-9" aria-label="Search notices" />
        </div>
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="tablist" aria-label="Filter by category">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={category === c}
              onClick={() => setCategory(c)}
              className={cn(
                "whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                category === c ? "border-primary bg-primary/15 text-foreground" : "bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Bell} title="No notices found" description="Try a different category or search term." />
      ) : (
        <ul className="space-y-3">
          {filtered.map((n) => {
            const isOpen = openId === n.id;
            const isUnread = !read.includes(n.id);
            return (
              <li key={n.id} className={cn("rounded-2xl border bg-card shadow-soft transition-colors", isOpen && "border-primary/50")}>
                <button type="button" onClick={() => toggle(n.id)} className="flex w-full items-start gap-4 p-4 text-left sm:p-5" aria-expanded={isOpen}>
                  <span className={cn("mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full", isUnread ? "bg-cyan" : "bg-muted")} aria-label={isUnread ? "Unread" : "Read"} />
                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                      <Chip className={noticeTone[n.category]}>{n.category}</Chip>
                      {n.pinned && (
                        <Chip className="border-cyan/30 bg-cyan/10 text-cyan">
                          <Pin className="h-3 w-3" /> Pinned
                        </Chip>
                      )}
                      {n.important && (
                        <Chip className="border-warning/30 bg-warning/10 text-warning">
                          <Star className="h-3 w-3" /> Important
                        </Chip>
                      )}
                    </div>
                    <p className={cn("text-base text-foreground", isUnread ? "font-semibold" : "font-medium")}>{n.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{n.summary}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {n.from} · {formatDate(n.date)} ({relativeDayLabel(n.date)})
                    </p>
                  </div>
                  <ChevronDown className={cn("mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
                </button>
                {isOpen && (
                  <div className="border-t px-4 pb-5 pt-4 sm:px-5 sm:pl-[3.4rem]">
                    <p className="text-sm leading-relaxed text-foreground/90">{n.body}</p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
