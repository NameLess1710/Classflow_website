import { Navigate, Outlet, createFileRoute, useHydrated, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { SidebarNav } from "@/components/layout/SidebarNav";
import { Topbar } from "@/components/layout/Topbar";
import { PageSearch } from "@/components/layout/PageSearch";
import { LogoMark } from "@/components/brand/Logo";
import { sessionStore } from "@/lib/stores";

export const Route = createFileRoute("/_student")({
  component: StudentLayout,
});

function StudentLayout() {
  const hydrated = useHydrated();
  if (!hydrated) return <LoadingScreen />;
  return <StudentShell />;
}

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <LogoMark className="h-12 w-12 animate-pulse" />
        <p className="text-sm">Loading your dashboard…</p>
      </div>
    </div>
  );
}

function StudentShell() {
  const [session, setSession] = sessionStore.useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!session.loggedIn) return <Navigate to="/" />;

  const logout = () => {
    setSession({ loggedIn: false });
    setMobileOpen(false);
    toast.success("You have been logged out");
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r bg-sidebar lg:block">
        <SidebarNav onLogout={logout} />
      </aside>
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 bg-sidebar p-0 sm:max-w-xs">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SheetDescription className="sr-only">Go to any Univo page</SheetDescription>
          <SidebarNav onNavigate={() => setMobileOpen(false)} onLogout={logout} />
        </SheetContent>
      </Sheet>
      <PageSearch open={searchOpen} onOpenChange={setSearchOpen} />
      <div className="lg:pl-64">
        <Topbar onMenu={() => setMobileOpen(true)} onLogout={logout} onSearch={() => setSearchOpen(true)} />
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
