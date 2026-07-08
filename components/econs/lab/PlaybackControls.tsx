"use client";

export default function PlaybackControls({
  playing,
  onTogglePlay,
  onStep,
  speed,
  onSpeedChange,
}: {
  playing: boolean;
  onTogglePlay: () => void;
  onStep: (delta: number) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={onTogglePlay}
        className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
      >
        {playing ? "⏸ Pause" : "▶ Play"}
      </button>
      <button
        type="button"
        onClick={() => onStep(-1)}
        className="px-3 py-1.5 rounded-full border border-card-border text-sm font-medium text-body hover:border-accent transition-colors"
      >
        ◀
      </button>
      <button
        type="button"
        onClick={() => onStep(1)}
        className="px-3 py-1.5 rounded-full border border-card-border text-sm font-medium text-body hover:border-accent transition-colors"
      >
        ▶
      </button>
      <div className="flex items-center gap-1 ml-2">
        {[0.5, 1, 2].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onSpeedChange(s)}
            className={`px-2.5 py-1 rounded-full border text-xs font-medium transition-colors ${
              speed === s ? "border-accent bg-muted text-accent" : "border-card-border text-secondary hover:border-accent"
            }`}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  );
}
