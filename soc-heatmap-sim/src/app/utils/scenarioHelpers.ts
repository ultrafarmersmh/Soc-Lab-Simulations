export function scenarioLabel(id: string): string {
  return id.split('-').join(' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
