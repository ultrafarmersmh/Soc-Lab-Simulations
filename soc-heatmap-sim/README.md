# SOC Heatmap Simulator (Scaffold)

A React + TypeScript + Vite scaffold for a SOC operational visualization simulator.

## Purpose

This project establishes a modular foundation for simulating SOC operations across authoritative zones:

- SOC-WAN
- SOC-MGMT
- SOC-LAN
- SOC-SIEM
- SOC-SERVER
- SOC-LAB
- SOC-USER

The initial scaffold includes:

- JSON-driven topology and data assets under `public/data`
- Professional dark dashboard layout with four panes
- SVG topology canvas rendering zones and routed links from `topology.json`
- OPNsense rendered as a distinct central core node
- Placeholder metrics, timeline, and security overlay panels
- Typed models for topology, assets, timeline events, metrics, and scenario state

## Run locally

```bash
npm install
npm run dev
```

## Build check

```bash
npm run build
```

## Structure

The project follows the requested modular layout:

- `src/app/layout`
- `src/app/topology`
- `src/app/metrics`
- `src/app/timeline`
- `src/app/overlays`
- `src/app/data`
- `src/app/hooks`
- `src/app/utils`
- `src/app/styles`

This is the first stage scaffold and intentionally keeps non-topology panes as placeholders.
