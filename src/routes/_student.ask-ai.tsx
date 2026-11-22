import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Bot, BookOpen, CalendarClock, Info, RotateCcw, Send, Sparkles, User } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { DemoBadge } from "@/components/common/DemoBadge";
import { SectionCard } from "@/components/common/SectionCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { NOT_CONNECTED_REPLY, SAMPLE_PROMPTS, type SamplePrompt } from "@/lib/ai-demo";
import { profileStore } from "@/lib/stores";
import { initials } from "@/lib/tones";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_student/ask-ai")({
  head: () => pageHead("Ask CampusPulse AI", "Preview the CampusPulse AI study assistant with interactive sample prompts. AI is not connected yet."),
  component: AskAiPage,
});

interface Message {
  id: number;
  role: "user" | "assistant";
  text: string;
  kind?: "sample" | "not-connected";
}

const CAPABILITIES = [
  { icon: BookOpen, title: "Explain topics", text: "Simple explanations of tough concepts from your syllabus." },
  { icon: CalendarClock, title: "Plan revision", text: "Study plans built around your exams and deadlines." },
  { icon: Sparkles, title: "Summarise notices", text: "Short digests of important college announcements." },
];

function AskAiPage() {
  const [profile] = profileStore.useStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const counter = useRef(0);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const push = (userText: string, reply: Omit<Message, "id" | "role">) => {
    setMessages((m) => [
      ...m,
      { id: ++counter.current, role: "user", text: userText },
      { id: ++counter.current, role: "assistant", ...reply },
    ]);
  };

  const askSample = (p: SamplePrompt) => push(p.prompt, { text: p.sampleAnswer, kind: "sample" });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    const match = SAMPLE_PROMPTS.find((p) => p.prompt.toLowerCase() === text.toLowerCase());
    push(text, match ? { text: match.sampleAnswer, kind: "sample" } : { text: NOT_CONNECTED_REPLY, kind: "not-connected" });
    setInput("");
  };

  return (
    <div>
      <PageHeader
        title="Ask CampusPulse AI"
        description="Your future study assistant. This is a preview: replies are pre-written examples, not live AI answers."
        icon={Bot}
        actions={<DemoBadge label="Demo · AI not connected" />}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="flex h-[calc(100vh-14rem)] min-h-[520px] flex-col rounded-2xl border bg-card shadow-soft">
          <div className="flex items-center justify-between border-b px-4 py-3 sm:px-5">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand text-cyan-foreground">
                <Bot className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold">CampusPulse AI</p>
                <p className="text-xs text-muted-foreground">Preview mode · sample answers only</p>
              </div>
            </div>
            {messages.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setMessages([])}>
                <RotateCcw /> Clear
              </Button>
            )}
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5" aria-live="polite">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                  <Sparkles className="h-7 w-7" />
                </span>
                <h2 className="text-lg font-semibold">Hi {profile.name.split(" ")[0]}, what would you like to try?</h2>
                <p className="mt-1 max-w-md text-sm text-muted-foreground">Pick a sample prompt to see the kind of help CampusPulse AI will give once it's connected.</p>
                <div className="mt-6 grid w-full max-w-2xl gap-2 sm:grid-cols-2">
                  {SAMPLE_PROMPTS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => askSample(p)}
                      className="rounded-xl border bg-surface p-3 text-left transition-colors hover:border-primary/50"
                    >
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-cyan">{p.category}</span>
                      <span className="mt-0.5 block text-sm text-foreground">{p.prompt}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m) => (
                <div key={m.id} className={cn("flex gap-3", m.role === "user" && "flex-row-reverse")}>
                  <span
                    className={cn(
                      "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                      m.role === "user" ? "bg-gradient-brand text-cyan-foreground" : "bg-primary/15 text-primary",
                    )}
                    aria-hidden
                  >
                    {m.role === "user" ? initials(profile.name) || <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </span>
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                      m.role === "user" ? "rounded-tr-sm bg-primary text-primary-foreground" : "rounded-tl-sm border bg-surface text-foreground",
                    )}
                  >
                    {m.role === "assistant" && (
                      <DemoBadge className="mb-2" label={m.kind === "sample" ? "Sample response · not AI-generated" : "AI not connected"} />
                    )}
                    <p className="whitespace-pre-line">{m.text}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={endRef} />
          </div>

          {messages.length > 0 && (
            <div className="flex gap-2 overflow-x-auto border-t px-4 py-2.5 sm:px-5">
              {SAMPLE_PROMPTS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => askSample(p)}
                  className="whitespace-nowrap rounded-full border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={submit} className="flex items-end gap-2 border-t p-3 sm:p-4">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit(e);
                }
              }}
              rows={1}
              placeholder="Type a question… (live answers need an AI connection)"
              className="max-h-32 min-h-11 resize-none"
              aria-label="Message"
            />
            <Button type="submit" variant="gradient" size="icon" className="h-11 w-11 shrink-0" disabled={!input.trim()} aria-label="Send">
              <Send />
            </Button>
          </form>
        </section>

        <aside className="space-y-6">
          <SectionCard title="About this preview" icon={Info}>
            <p className="text-sm text-muted-foreground">
              No AI is running here yet. Sample prompts show pre-written example answers so you can see how the assistant will work. Custom questions won't be answered until an AI service is connected.
            </p>
          </SectionCard>
          <SectionCard title="Planned capabilities" icon={Sparkles}>
            <ul className="space-y-4">
              {CAPABILITIES.map((c) => (
                <li key={c.title} className="flex gap-3">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan/15 text-cyan">
                    <c.icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{c.title}</p>
                    <p className="text-xs text-muted-foreground">{c.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>
        </aside>
      </div>
    </div>
  );
}
