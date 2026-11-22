import { Target } from "lucide-react";
import { SectionCard } from "@/components/common/SectionCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { MAX_GRADE_POINT, requiredGpaForTarget } from "@/lib/academics";
import { cgpaGoalStore } from "@/lib/stores";
import { cn } from "@/lib/utils";

export function TargetSimulator({ currentCgpa, completedCredits }: { currentCgpa: number; completedCredits: number }) {
  const [goal, setGoal] = cgpaGoalStore.useStore();
  const remainingCredits = goal.remainingSemesters * goal.creditsPerSemester;
  const result = requiredGpaForTarget(currentCgpa, completedCredits, goal.target, remainingCredits);
  const scenarios = [7, 8, 8.5, 9, 9.5, 10];

  const projected = (sgpa: number) =>
    completedCredits + remainingCredits === 0 ? 0 : (currentCgpa * completedCredits + sgpa * remainingCredits) / (completedCredits + remainingCredits);

  return (
    <SectionCard title="Target goal simulator" icon={Target}>
      <div className="space-y-5">
        <div>
          <div className="flex items-center justify-between">
            <Label>Target CGPA</Label>
            <span className="font-display text-xl font-semibold text-cyan">{goal.target.toFixed(1)}</span>
          </div>
          <Slider
            className="mt-3"
            min={5}
            max={10}
            step={0.1}
            value={[goal.target]}
            onValueChange={([v]) => { if (v !== undefined) setGoal((g) => ({ ...g, target: Math.round(v * 10) / 10 })); }}
            aria-label="Target CGPA"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="rem-sem" className="text-xs">Semesters left</Label>
            <Input
              id="rem-sem"
              inputMode="numeric"
              className="mt-1"
              value={goal.remainingSemesters}
              onChange={(e) => setGoal((g) => ({ ...g, remainingSemesters: Math.min(12, parseInt(e.target.value.replace(/\D/g, ""), 10) || 0) }))}
            />
          </div>
          <div>
            <Label htmlFor="cred-sem" className="text-xs">Credits / semester</Label>
            <Input
              id="cred-sem"
              inputMode="numeric"
              className="mt-1"
              value={goal.creditsPerSemester}
              onChange={(e) => setGoal((g) => ({ ...g, creditsPerSemester: Math.min(40, parseInt(e.target.value.replace(/\D/g, ""), 10) || 0) }))}
            />
          </div>
        </div>

        <div
          className={cn(
            "rounded-xl border p-4",
            result.alreadyMet ? "border-success/30 bg-success/10" : result.feasible ? "border-primary/40 bg-primary/10" : "border-destructive/30 bg-destructive/10",
          )}
        >
          {remainingCredits === 0 ? (
            <p className="text-sm text-muted-foreground">Add remaining semesters and credits to simulate your goal.</p>
          ) : result.alreadyMet ? (
            <p className="text-sm font-semibold text-success">You're already on track. Even a low SGPA keeps you above {goal.target.toFixed(1)}.</p>
          ) : result.feasible ? (
            <>
              <p className="text-xs font-medium text-muted-foreground">Required average SGPA</p>
              <p className="font-display text-3xl font-semibold text-foreground">{result.requiredGpa.toFixed(2)}</p>
              <p className="mt-1 text-xs text-foreground/80">
                Score at least this in each of the next {goal.remainingSemesters} semester{goal.remainingSemesters === 1 ? "" : "s"} ({remainingCredits} credits) to reach {goal.target.toFixed(1)}.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-destructive">Not reachable with {remainingCredits} credits left</p>
              <p className="mt-1 text-xs text-foreground/80">
                You'd need an average of {result.requiredGpa.toFixed(2)}, above the maximum of {MAX_GRADE_POINT}. Try a lower target.
              </p>
            </>
          )}
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">If you score this every semester</p>
          <div className="grid grid-cols-3 gap-2">
            {scenarios.map((s) => {
              const p = projected(s);
              return (
                <div key={s} className={cn("rounded-lg border bg-surface p-2 text-center", p >= goal.target && "border-success/40")}>
                  <p className="text-[11px] text-muted-foreground">SGPA {s}</p>
                  <p className={cn("font-display text-sm font-semibold", p >= goal.target ? "text-success" : "text-foreground")}>{p.toFixed(2)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
