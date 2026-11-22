import { useState } from "react";
import { Calculator } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { SectionCard } from "@/components/common/SectionCard";
import { Meter } from "@/components/common/Meter";
import { attendancePercent, attendanceStatus } from "@/lib/academics";
import { attendanceTone } from "@/lib/tones";
import { cn } from "@/lib/utils";

function toInt(v: string) {
  const n = parseInt(v, 10);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export function AttendanceCalculator({ defaultThreshold }: { defaultThreshold: number }) {
  const [attended, setAttended] = useState("42");
  const [total, setTotal] = useState("58");
  const [threshold, setThreshold] = useState(String(defaultThreshold));
  const [skip, setSkip] = useState(2);

  const a = toInt(attended);
  const t = Math.max(toInt(total), 0);
  const th = Math.min(Math.max(toInt(threshold), 1), 100);
  const invalid = a > t;
  const status = attendanceStatus(a, t, th);
  const afterSkip = attendancePercent(a, t + skip);
  const tone = attendanceTone(status.percent, th);

  return (
    <SectionCard title="Safe-to-miss calculator" icon={Calculator}>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label htmlFor="calc-att" className="text-xs">Attended</Label>
          <Input id="calc-att" inputMode="numeric" className="mt-1" value={attended} onChange={(e) => setAttended(e.target.value.replace(/\D/g, ""))} />
        </div>
        <div>
          <Label htmlFor="calc-tot" className="text-xs">Total held</Label>
          <Input id="calc-tot" inputMode="numeric" className="mt-1" value={total} onChange={(e) => setTotal(e.target.value.replace(/\D/g, ""))} />
        </div>
        <div>
          <Label htmlFor="calc-th" className="text-xs">Required %</Label>
          <Input id="calc-th" inputMode="numeric" className="mt-1" value={threshold} onChange={(e) => setThreshold(e.target.value.replace(/\D/g, ""))} />
        </div>
      </div>

      {invalid ? (
        <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          Attended classes can't be more than total classes held.
        </p>
      ) : status.kind === "empty" ? (
        <p className="mt-4 text-sm text-muted-foreground">Enter the number of classes held to see your status.</p>
      ) : (
        <div className="mt-5 space-y-4">
          <div>
            <div className="mb-1.5 flex items-end justify-between">
              <span className="font-display text-3xl font-semibold">{status.percent.toFixed(1)}%</span>
              <span className="text-xs text-muted-foreground">Required {th}%</span>
            </div>
            <Meter value={status.percent} tone={tone} marker={th} />
          </div>
          <div
            className={cn(
              "rounded-xl border p-4",
              status.kind === "safe" ? "border-success/30 bg-success/10" : "border-destructive/30 bg-destructive/10",
            )}
          >
            {status.kind === "safe" ? (
              <>
                <p className="text-sm font-semibold text-success">Safe to miss: {status.canMiss} class{status.canMiss === 1 ? "" : "es"}</p>
                <p className="mt-1 text-xs text-foreground/80">
                  You can skip up to {status.canMiss} more class{status.canMiss === 1 ? "" : "es"} and still stay at or above {th}%.
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-destructive">Must attend: {status.mustAttend} class{status.mustAttend === 1 ? "" : "es"} in a row</p>
                <p className="mt-1 text-xs text-foreground/80">Attend the next {status.mustAttend} classes without a break to reach {th}%.</p>
              </>
            )}
          </div>
          <div className="rounded-xl border bg-surface p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">What if I miss the next {skip} class{skip === 1 ? "" : "es"}?</span>
              <span className={cn("font-semibold", afterSkip >= th ? "text-success" : "text-destructive")}>{afterSkip.toFixed(1)}%</span>
            </div>
            <Slider className="mt-3" min={0} max={15} step={1} value={[skip]} onValueChange={([v]) => { if (v !== undefined) setSkip(v); }} aria-label="Classes to miss" />
          </div>
        </div>
      )}
    </SectionCard>
  );
}
