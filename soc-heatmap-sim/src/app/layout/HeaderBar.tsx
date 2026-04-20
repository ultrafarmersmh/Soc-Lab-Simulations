import type { ReactNode } from 'react';

interface HeaderBarProps {
  title: string;
  subtitle?: string;
  rightContent?: ReactNode;
}

export function HeaderBar({ title, subtitle, rightContent }: HeaderBarProps) {
  return (
    <header className="header-bar">
      <div>
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {rightContent ? <div>{rightContent}</div> : null}
    </header>
  );
}
