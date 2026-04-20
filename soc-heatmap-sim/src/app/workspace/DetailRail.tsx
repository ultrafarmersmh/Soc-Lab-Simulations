import { useState } from 'react';
import type { Zone } from '../data/types';
import type { HeatMode } from '../hooks/useIncidentState';
import type { ZoneMetricSnapshot } from '../hooks/useZoneMetrics';
import { ZoneAlertsTab } from './ZoneAlertsTab';
import { ZoneMitreTab } from './ZoneMitreTab';
import { ZoneOverviewTab } from './ZoneOverviewTab';
import { ZoneRiskTab } from './ZoneRiskTab';

interface DetailRailProps {
  zone: Zone | null;
  snapshot: ZoneMetricSnapshot;
  activeMode: HeatMode;
}

const tabs = ['Overview', 'Alerts', 'MITRE', 'Risk'] as const;
type Tab = (typeof tabs)[number];

export function DetailRail({ zone, snapshot, activeMode }: DetailRailProps) {
  const [activeTab, setActiveTab] = useState<Tab>('Overview');

  return (
    <aside className="detail-rail" aria-label="Zone detail rail">
      <header>
        <span>Zone Detail</span>
        <h2>{zone?.id ?? 'No zone selected'}</h2>
      </header>

      <div className="rail-tabs">
        {tabs.map((tab) => (
          <button type="button" key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Overview' ? <ZoneOverviewTab snapshot={snapshot} activeMode={activeMode} /> : null}
      {activeTab === 'Alerts' ? <ZoneAlertsTab snapshot={snapshot} /> : null}
      {activeTab === 'MITRE' ? <ZoneMitreTab /> : null}
      {activeTab === 'Risk' ? <ZoneRiskTab snapshot={snapshot} /> : null}

      <section>
        <h3>Representative Assets</h3>
        <ul className="mini-list">
          {snapshot.topAssets.map((asset) => (
            <li key={asset.id}>
              <span>{asset.id}</span>
              <strong>{asset.criticality}</strong>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Top Ingress Flows</h3>
        <ul className="mini-list">
          {snapshot.ingressFlows.map((flow) => (
            <li key={flow.route}>
              <span>{flow.route}</span>
              <strong>{flow.intensity}</strong>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Top Flows</h3>
        <ul className="mini-list">
          {snapshot.topFlows.map((flow) => (
            <li key={flow.route}>
              <span>{flow.route}</span>
              <strong>{flow.intensity}</strong>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
