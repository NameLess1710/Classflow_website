import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarClock, ClipboardList, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { Chip } from "@/components/common/Chip";
import { Meter } from "@/components/common/Meter";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { assignmentsStore, newId } from "@/lib/stores";
import { SUBJECT_NAMES } from "@/lib/sample-data";
import { daysUntil, formatDate, isoDaysFromNow, relativeDayLabel } from "@/lib/dates";
import { priorityTone } from "@/lib/tones";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_student/assignments")({
  head: () => pageHead("Assignments", "Track assignment deadlines by subject and priority, and mark work as completed."),
  component: AssignmentsPage,
});

function AssignmentsPage() {
  const [items, setItems] = assignmentsStore.useStore();
  const [tab, setTab] = useState("pending");
  const [adding, setAdding] = useState(false);

  const done = items.filter((a) => a.completed).length;
  const pending = items.length - done;
  const overdue = items.filter((a) => !a.completed && daysUntil(a.dueDate) < 0).length;

  const list = items
    .filter((a) => (tab === "all" ? true : tab === "completed" ? a.completed : !a.completed))
    .sort((a, b) => (tab === "completed" ? b.dueDate.localeCompare(a.dueDate) : a.dueDate.localeCompare(b.dueDate)));

  const toggle = (id) => {
    const target = items.find((a) => a.id === id);
    setItems((xs) =>
      xs.map((a) => {
        if (a.id !== id) return a;
        if (!a.completed) return { ...a, completed: true, completedAt: isoDaysFromNow(0) };
        const { completedAt, ...pending } = a;
        return { ...pending, completed: false };
      }),
    );
    if (target) toast.success(target.completed ? "Moved back to pending" : "Marked as completed");
  };

  const remove = (id) => {
    setItems((xs) => xs.filter((a) => a.id !== id));
    toast.success("Assignment removed");
  };

  const tabs = [
    { id: "pending", label: "Pending", count: pending },
    { id: "completed", label: "Completed", count: done },
    { id: "all", label: "All", count: items.length },
  ];

  return (
    <div>
      <PageHeader
        title="Assignments"
        description="Tick off work as you finish it. Your progress is saved on this device."
        icon={ClipboardList}
        actions={
          <Button variant="gradient" onClick={() => setAdding(true)}>
            <Plus /> Add assignment
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 rounded-2xl border bg-card p-5 shadow-soft sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold">Semester progress</span>
            <span className="text-muted-foreground">
              {done} of {items.length} completed
            </span>
          </div>
          <Meter value={done} max={Math.max(items.length, 1)} />
        </div>
        <div className="flex gap-6 text-sm">
          <div>
            <p className="font-display text-xl font-semibold text-warning">{pending}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
          <div>
            <p className="font-display text-xl font-semibold text-destructive">{overdue}</p>
            <p className="text-xs text-muted-foreground">Overdue</p>
          </div>
          <div>
            <p className="font-display text-xl font-semibold text-success">{done}</p>
            <p className="text-xs text-muted-foreground">Done</p>
          </div>
        </div>
      </div>

      <div className="mb-4 inline-flex rounded-xl border bg-card p-1" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors",
              tab === t.id ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label} <span className="ml-1 text-xs text-muted-foreground">{t.count}</span>
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title={tab === "pending" ? "Nothing pending" : "No assignments here"}
          description={tab === "pending" ? "Great work! You're all caught up." : "Completed assignments will show up here."}
        />
      ) : (
        <ul className="space-y-3">
          {list.map((a) => (
            <AssignmentRow key={a.id} a={a} onToggle={() => toggle(a.id)} onRemove={() => remove(a.id)} />
          ))}
        </ul>
      )}

      <AddAssignmentDialog
        open={adding}
        onOpenChange={setAdding}
        onSave={(a) => {
          setItems((xs) => [...xs, a]);
          setTab("pending");
          toast.success("Assignment added");
        }}
      />
    </div>
  );
}

function AssignmentRow({ a, onToggle, onRemove }) {
  const d = daysUntil(a.dueDate);
  const dueText = a.completed
    ? `Completed${a.completedAt ? ` on ${formatDate(a.completedAt, "d MMM")}` : ""}`
    : d < 0
      ? `Overdue by ${Math.abs(d)} day${Math.abs(d) > 1 ? "s" : ""}`
      : `Due ${relativeDayLabel(a.dueDate).toLowerCase()}`;
  return (
    <li className={cn("flex gap-4 rounded-2xl border bg-card p-4 shadow-soft sm:p-5", a.completed && "opacity-75")}>
      <Checkbox checked={a.completed} onCheckedChange={onToggle} className="mt-1 h-5 w-5" aria-label={`Mark "${a.title}" as ${a.completed ? "pending" : "completed"}`} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <p className={cn("font-semibold text-foreground", a.completed && "line-through decoration-muted-foreground")}>{a.title}</p>
          <div className="flex items-center gap-2">
            {a.marks !== undefined && <Chip className="border-success/30 bg-success/10 text-success">{a.marks}/10</Chip>}
            <Chip className={priorityTone[a.priority]}>{a.priority}</Chip>
          </div>
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground">{a.subject}</p>
        <p className="mt-2 text-sm text-foreground/80">{a.description}</p>
        <div className="mt-3 flex items-center justify-between gap-2">
          <p
            className={cn(
              "flex items-center gap-1.5 text-xs font-semibold",
              a.completed ? "text-success" : d < 0 ? "text-destructive" : d <= 2 ? "text-warning" : "text-cyan",
            )}
          >
            <CalendarClock className="h-3.5 w-3.5" /> {dueText} · {formatDate(a.dueDate)}
          </p>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive" onClick={onRemove} aria-label={`Delete ${a.title}`}>
            <Trash2 />
          </Button>
        </div>
      </div>
    </li>
  );
}

function AddAssignmentDialog({ open, onOpenChange, onSave }) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState(SUBJECT_NAMES[0] ?? "");
  const [dueDate, setDueDate] = useState(() => isoDaysFromNow(7));
  const [priority, setPriority] = useState("Medium");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) {
      setError("Add a title and due date.");
      return;
    }
    onSave({ id: newId("asg"), title: title.trim(), subject, dueDate, priority, description: description.trim(), completed: false });
    setTitle("");
    setDescription("");
    setError("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">Add assignment</DialogTitle>
          <DialogDescription>Keep track of work set in class.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="atitle">Title</Label>
            <Input id="atitle" className="mt-1.5" placeholder="e.g. Write a report on TCP congestion control" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="asubject">Subject</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger id="asubject" className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECT_NAMES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="adue">Due date</Label>
              <Input id="adue" type="date" className="mt-1.5" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="aprio">Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v)}>
                <SelectTrigger id="aprio" className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["High", "Medium", "Low"].map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="adesc">Details (optional)</Label>
            <Textarea id="adesc" className="mt-1.5" placeholder="Submission format, word limit…" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          {error && <p className="text-sm font-medium text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient">
              Add assignment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
