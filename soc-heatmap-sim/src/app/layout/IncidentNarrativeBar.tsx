interface IncidentNarrativeBarProps {
  text: string;
  phase: string;
  severity: string;
}

export function IncidentNarrativeBar({ text, phase, severity }: IncidentNarrativeBarProps) {
  return (
    <section className="incident-narrative" aria-label="Scenario and status strip">
      <span className="incident-phase">{phase}</span>
      <p>{text}</p>
      <strong className={`incident-severity ${severity.toLowerCase()}`}>{severity}</strong>
    </section>
  );
}
