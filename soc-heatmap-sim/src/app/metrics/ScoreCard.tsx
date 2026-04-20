interface ScoreCardProps {
  label: string;
  value: number | string;
}

export function ScoreCard({ label, value }: ScoreCardProps) {
  return (
    <article className="score-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}
