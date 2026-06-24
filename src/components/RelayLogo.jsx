// RELAY 8-bit pixel logomark. Navy (#16233f) rects on a 24×32 grid, rendered
// with crisp edges (no anti-aliasing) per the brand note. Default render box is
// 18×24, matching both the card header and the engine panel.
const PIXELS = [
  [0, 0], [4, 0], [8, 0], [12, 0], [16, 0],
  [0, 4], [4, 4], [16, 4], [20, 4],
  [0, 8], [4, 8], [16, 8], [20, 8],
  [0, 12], [4, 12], [8, 12], [12, 12], [16, 12],
  [0, 16], [4, 16], [8, 16], [12, 16],
  [0, 20], [4, 20], [12, 20], [16, 20],
  [16, 24], [20, 24],
  [0, 28], [20, 28],
]

export default function RelayLogo({ width = 18, height = 24 }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 32"
      fill="#16233f"
      shapeRendering="crispEdges"
      style={{ display: 'block', flex: 'none' }}
    >
      {PIXELS.map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="4" height="4" />
      ))}
    </svg>
  )
}
