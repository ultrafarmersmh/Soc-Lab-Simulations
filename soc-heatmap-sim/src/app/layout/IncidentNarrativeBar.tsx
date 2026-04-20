interface IncidentNarrativeBarProps {
  text: string;
  phase: string;
}

export function IncidentNarrativeBar({ text, phase }: IncidentNarrativeBarProps) {
  return (
    <section className="incident-narrative" aria-label="Scenario and status strip">
      <span className="incident-phase">{phase}</span>
      <p>{text}</p>
    </section>
  );
}
