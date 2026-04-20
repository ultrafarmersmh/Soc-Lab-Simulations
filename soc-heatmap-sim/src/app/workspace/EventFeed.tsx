import type { IncidentEventItem } from '../hooks/useIncidentState';

interface EventFeedProps {
  events: IncidentEventItem[];
}

export function EventFeed({ events }: EventFeedProps) {
  const rows = [...events].slice(-6).reverse();

  return (
    <section className="event-feed" aria-label="Event feed">
      <header>
        <h3>SOC Event Log</h3>
      </header>
      {rows.map((event, index) => (
        <div key={`${event.timestamp}-${event.title}`} className={`event-row ${index === 0 ? 'newest' : ''}`}>
          <time>{String(Math.floor(event.timestamp / 60)).padStart(2, '0')}:{String(event.timestamp % 60).padStart(2, '0')}</time>
          <span className={`severity-chip ${event.severity}`}>{event.severity}</span>
          <div>
            <p>{event.title}</p>
            <small>{event.detail}</small>
          </div>
        </div>
      ))}
    </section>
  );
}
