import { useId } from "react";
import { cn } from "@/lib/utils";

/** CampusPulse AI brand mark: a pulse line rising into a graduation-cap peak. */
export function LogoMark({ className }) {
  const id = useId();
  return (
    <svg viewBox="0 0 40 40" className={cn("h-9 w-9 shrink-0", className)} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0" style={{ stopColor: "var(--primary)" }} />
          <stop offset="1" style={{ stopColor: "var(--cyan)" }} />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill={`url(#${id}-g)`} />
      <path d="M20 8.5 31 13.5 20 18.5 9 13.5Z" style={{ fill: "var(--background)" }} opacity="0.92" />
      <path
        d="M7 27h6.5l2.5-5 4 9 3.5-7 2 3H33"
        fill="none"
        style={{ stroke: "var(--background)" }}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({ className, compact = false }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      {!compact && (
        <span className="font-display text-lg font-bold leading-none tracking-tight text-foreground">
          CampusPulse
          <span className="ml-1.5 rounded-md bg-gradient-brand px-1.5 py-0.5 align-middle text-xs font-bold text-cyan-foreground">
            AI
          </span>
        </span>
      )}
    </span>
  );
}
