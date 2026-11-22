import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, Download, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { Chip } from "@/components/common/Chip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SUBJECT_NAMES } from "@/lib/sample-data";
import { newId, notesStore } from "@/lib/stores";
import { formatDate, isoDaysFromNow, relativeDayLabel } from "@/lib/dates";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_student/notes")({
  head: () => pageHead("Study Notes", "Your personal notes and faculty-shared study documents, organised by subject."),
  component: NotesPage,
});

const kindTone = {
  PDF: "bg-destructive/15 text-destructive",
  DOCX: "bg-cyan/15 text-cyan",
  PPT: "bg-warning/15 text-warning",
  Note: "bg-primary/15 text-primary",
};

function NotesPage() {
  const [notes, setNotes] = notesStore.useStore();
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("all");
  const [adding, setAdding] = useState(false);
  const [viewing, setViewing] = useState(null);

  const filtered = notes
    .filter((n) => subject === "all" || n.subject === subject)
    .filter((n) => `${n.title} ${n.content} ${n.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const remove = (id) => {
    setNotes((ns) => ns.filter((n) => n.id !== id));
    setViewing(null);
    toast.success("Note deleted");
  };

  return (
    <div>
      <PageHeader
        title="Study Notes"
        description="Write your own notes and browse documents shared by faculty. Notes you add are saved on this device."
        icon={BookOpen}
        actions={
          <Button variant="gradient" onClick={() => setAdding(true)}>
            <Plus /> Add note
          </Button>
        }
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search titles, content or tags…" value={query} onChange={(e) => setQuery(e.target.value)} className="h-10 pl-9" aria-label="Search notes" />
        </div>
        <Select value={subject} onValueChange={setSubject}>
          <SelectTrigger className="h-10 sm:w-72" aria-label="Filter by subject">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All subjects</SelectItem>
            {SUBJECT_NAMES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No notes yet"
          description={query || subject !== "all" ? "Nothing matches your filters." : "Add your first note to get started."}
          action={
            <Button variant="gradient" onClick={() => setAdding(true)}>
              <Plus /> Add note
            </Button>
          }
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => setViewing(n)}
                className="flex h-full w-full flex-col rounded-2xl border bg-card p-5 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/50"
              >
                <div className="flex items-start gap-3">
                  <span className={cn("inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xs font-bold", kindTone[n.kind])}>{n.kind}</span>
                  <div className="min-w-0">
                    <p className="line-clamp-2 font-semibold text-foreground">{n.title}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">{n.subject}</p>
                  </div>
                </div>
                <p className="mt-3 line-clamp-3 flex-1 whitespace-pre-line text-sm text-muted-foreground">{n.content}</p>
                <div className="mt-4 flex flex-wrap items-center gap-1.5">
                  {n.tags.slice(0, 3).map((t) => (
                    <Chip key={t} className="border-border bg-surface text-muted-foreground">
                      #{t}
                    </Chip>
                  ))}
                  <span className="ml-auto text-xs text-muted-foreground">
                    {n.uploadedBy ?? "You"} · {relativeDayLabel(n.createdAt)}
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      <AddNoteDialog
        open={adding}
        onOpenChange={setAdding}
        onSave={(note) => {
          setNotes((ns) => [note, ...ns]);
          toast.success("Note saved");
        }}
      />

      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-w-2xl">
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle className="pr-6 font-display text-xl">{viewing.title}</DialogTitle>
                <DialogDescription>
                  {viewing.subject} · {viewing.uploadedBy ?? "You"} · {formatDate(viewing.createdAt)}
                  {viewing.size ? ` · ${viewing.size}` : ""}
                </DialogDescription>
              </DialogHeader>
              <div className="max-h-[50vh] overflow-y-auto whitespace-pre-line rounded-xl border bg-surface p-4 text-sm leading-relaxed text-foreground/90">
                {viewing.content}
              </div>
              <DialogFooter className="gap-2 sm:justify-between">
                {viewing.uploadedBy === "You" ? (
                  <Button variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => remove(viewing.id)}>
                    <Trash2 /> Delete note
                  </Button>
                ) : (
                  <span />
                )}
                {viewing.kind !== "Note" && (
                  <Button variant="outline" onClick={() => toast.info("File downloads will be available once document storage is connected.")}>
                    <Download /> Download {viewing.kind}
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AddNoteDialog({ open, onOpenChange, onSave }) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState(SUBJECT_NAMES[0] ?? "");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Add a title and some content.");
      return;
    }
    onSave({
      id: newId("note"),
      title: title.trim(),
      subject,
      content: content.trim(),
      kind: "Note",
      createdAt: isoDaysFromNow(0),
      uploadedBy: "You",
      tags: tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
    });
    setTitle("");
    setContent("");
    setTags("");
    setError("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">Add a study note</DialogTitle>
          <DialogDescription>Saved on this device. You can view or delete it anytime.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="ntitle">Title</Label>
            <Input id="ntitle" className="mt-1.5" placeholder="e.g. Deadlocks: conditions & prevention" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="nsubject">Subject</Label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger id="nsubject" className="mt-1.5">
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
            <Label htmlFor="ncontent">Content</Label>
            <Textarea id="ncontent" className="mt-1.5 min-h-36" placeholder="Write your key points, formulas or summaries…" value={content} onChange={(e) => setContent(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="ntags">Tags (comma separated)</Label>
            <Input id="ntags" className="mt-1.5" placeholder="unit 4, mid-sem" value={tags} onChange={(e) => setTags(e.target.value)} />
          </div>
          {error && <p className="text-sm font-medium text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient">
              Save note
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
