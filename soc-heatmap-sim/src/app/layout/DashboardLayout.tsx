import type { ReactNode } from 'react';

interface DashboardLayoutProps {
  topology: ReactNode;
  metrics: ReactNode;
  timeline: ReactNode;
  overlays: ReactNode;
}

export function DashboardLayout({ topology, metrics, timeline, overlays }: DashboardLayoutProps) {
  return (
    <main className="dashboard-grid">
      <section className="panel topology-panel">{topology}</section>
      <section className="panel metrics-panel">{metrics}</section>
      <section className="panel timeline-panel">{timeline}</section>
      <section className="panel overlay-panel">{overlays}</section>
    </main>
  );
}
