import type { BusinessCyclePhase } from "@/lib/econs/lab/businessCycleModel";

export const phaseConfig: Record<BusinessCyclePhase, { label: string; icon: string; color: string; bg: string }> = {
  recovery: { label: "Recovery", icon: "🚀", color: "var(--success)", bg: "var(--success)" },
  expansion: { label: "Expansion", icon: "📈", color: "var(--accent)", bg: "var(--accent)" },
  peak: { label: "Peak", icon: "🏔", color: "var(--accent-warm)", bg: "var(--accent-warm)" },
  recession: { label: "Recession", icon: "📉", color: "var(--error)", bg: "var(--error)" },
  trough: { label: "Trough", icon: "🕳", color: "var(--secondary)", bg: "var(--secondary)" },
};

export default function PhaseBadge({ phase, size = "md" }: { phase: BusinessCyclePhase; size?: "sm" | "md" }) {
  const config = phaseConfig[phase];
  const padding = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${padding}`}
      style={{ borderColor: config.color, color: config.color, backgroundColor: "var(--muted)" }}
    >
      <span aria-hidden="true">{config.icon}</span>
      {config.label}
    </span>
  );
}
