export function BackgroundGrid() {
  return (
    <g className="bg-grid" aria-hidden="true">
      {Array.from({ length: 16 }).map((_, index) => (
        <line key={`v-${index}`} x1={index * 60} y1={0} x2={index * 60} y2={420} />
      ))}
      {Array.from({ length: 9 }).map((_, index) => (
        <line key={`h-${index}`} x1={0} y1={index * 52} x2={960} y2={index * 52} />
      ))}
    </g>
  );
}
