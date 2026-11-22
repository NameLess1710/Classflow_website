import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogoMark } from "@/components/brand/Logo";
import { NAV_ITEMS } from "@/lib/nav";
import { profileStore, readNoticesStore } from "@/lib/stores";
import { initials } from "@/lib/tones";
import { sampleNotices } from "@/lib/sample-data";
import { useMemo } from "react";

export function Topbar({ onMenu, onLogout, onSearch }: { onMenu: () => void; onLogout: () => void; onSearch: () => void }) {
  const [profile] = profileStore.useStore();
  const [read] = readNoticesStore.useStore();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const current = NAV_ITEMS.find((i) => pathname.startsWith(i.to));
  const unread = useMemo(() => sampleNotices().filter((n) => !read.includes(n.id)).length, [read]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur-md sm:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenu} aria-label="Open menu">
        <Menu className="h-5 w-5" />
      </Button>
      <Link to="/dashboard" className="lg:hidden" aria-label="Dashboard">
        <LogoMark className="h-8 w-8" />
      </Link>
      <p className="hidden truncate font-display text-sm font-semibold text-muted-foreground sm:block lg:text-base lg:text-foreground">
        {current?.label ?? "CampusPulse AI"}
      </p>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={onSearch}
          className="hidden h-10 items-center gap-2 rounded-lg border bg-card px-3 text-sm text-muted-foreground transition-colors hover:text-foreground md:flex md:w-64"
        >
          <Search className="h-4 w-4" />
          <span>Jump to a page…</span>
          <kbd className="ml-auto rounded border bg-surface px-1.5 text-[10px] font-semibold">Ctrl K</kbd>
        </button>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onSearch} aria-label="Search pages">
          <Search className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" asChild className="relative">
          <Link to="/notices" aria-label={`Notices, ${unread} unread`}>
            <Bell className="h-5 w-5" />
            {unread > 0 && (
              <span className="absolute right-1.5 top-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-cyan px-1 text-[10px] font-bold text-cyan-foreground">
                {unread}
              </span>
            )}
          </Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg p-1 pr-2 transition-colors hover:bg-accent"
              aria-label="Account menu"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-brand text-xs font-bold text-cyan-foreground">
                {initials(profile.name)}
              </span>
              <span className="hidden text-left sm:block">
                <span className="block max-w-[9rem] truncate text-sm font-semibold leading-tight">{profile.name}</span>
                <span className="block text-xs leading-tight text-muted-foreground">{profile.rollNo}</span>
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <p className="text-sm font-semibold">{profile.name}</p>
              <p className="truncate text-xs text-muted-foreground">{profile.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile">Profile & Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/attendance">Attendance</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={onLogout} className="text-destructive focus:text-destructive">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
