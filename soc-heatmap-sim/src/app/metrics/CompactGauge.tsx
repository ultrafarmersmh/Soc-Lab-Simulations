interface CompactGaugeProps {
  label: string;
  value: number;
}

export function CompactGauge({ label, value }: CompactGaugeProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const degree = (clamped / 100) * 180;

  return (
    <div className="compact-gauge">
      <svg viewBox="0 0 120 70" role="img" aria-label={`${label} ${clamped}`}>
        <path d="M10 60 A50 50 0 0 1 110 60" className="gauge-track" />
        <path d="M10 60 A50 50 0 0 1 110 60" className="gauge-fill" strokeDasharray={`${degree * 0.87} 999`} />
      </svg>
      <strong>{clamped}</strong>
      <span>{label}</span>
    </div>
  );
}
