interface KPIChipProps {
  label: string;
  value: string;
}

export function KPIChip({ label, value }: KPIChipProps) {
  return (
    <div className="kpi-chip">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
