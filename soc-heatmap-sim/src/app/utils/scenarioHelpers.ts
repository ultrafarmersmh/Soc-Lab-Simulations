export function scenarioLabel(id: string): string {
  return id.replaceAll('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
