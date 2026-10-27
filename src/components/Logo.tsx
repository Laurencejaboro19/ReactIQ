import { cn } from "@/lib/utils";

export function LogoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("h-7 w-7", className)} aria-hidden="true" fill="none">
      <path
        d="M24.5 9.5A11 11 0 1 0 27 18"
        stroke="var(--primary)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M21 6.5l4.6 2.2-1.9 4.7" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="16" cy="16" r="3" fill="var(--primary)" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-display text-xl font-bold tracking-tight", className)}>
      <LogoIcon />
      <span>
        React<span className="text-primary">IQ</span>
      </span>
    </span>
  );
}
