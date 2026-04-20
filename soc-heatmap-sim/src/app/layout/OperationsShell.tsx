import type { ReactNode } from 'react';

interface OperationsShellProps {
  topBar: ReactNode;
  narrative: ReactNode;
  main: ReactNode;
}

export function OperationsShell({ topBar, narrative, main }: OperationsShellProps) {
  return (
    <div className="operations-shell">
      {topBar}
      {narrative}
      {main}
    </div>
  );
}
