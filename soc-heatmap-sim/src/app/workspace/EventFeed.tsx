import type { TimelineEvent } from '../data/types';

interface EventFeedProps {
  events: TimelineEvent[];
}

function severityFromType(type: string): 'Info' | 'Elevated' | 'Threat' {
  if (type.includes('scan') || type.includes('detection')) return 'Threat';
  if (type.includes('containment') || type.includes('stabilization')) return 'Elevated';
  return 'Info';
}

export function EventFeed({ events }: EventFeedProps) {
  const rows = [...events].slice(-6).reverse();

  return (
    <section className="event-feed" aria-label="Event feed">
      <header>
        <h3>Event Feed</h3>
      </header>
      {rows.map((event) => {
        const severity = severityFromType(event.type);

        return (
          <div key={`${event.timestamp}-${event.type}`} className="event-row">
            <time>{String(Math.floor(event.timestamp / 60)).padStart(2, '0')}:{String(event.timestamp % 60).padStart(2, '0')}</time>
            <span className={`severity-chip ${severity.toLowerCase()}`}>{severity}</span>
            <p>{event.type.replace(/_/g, ' ')}</p>
          </div>
        );
      })}
    </section>
  );
}
