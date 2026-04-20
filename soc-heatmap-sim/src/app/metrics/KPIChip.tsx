interface KPIChipProps {
  label: string;
  value: string;
  delta: number;
  state: 'normal' | 'elevated' | 'critical';
  priority: 'primary' | 'secondary';
}

export function KPIChip({ label, value, delta, state, priority }: KPIChipProps) {
  const sign = delta > 0 ? '+' : '';

  return (
    <div className={`kpi-chip ${state} ${priority}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <em>
        {sign}
        {delta}
      </em>
    </div>
  );
}
