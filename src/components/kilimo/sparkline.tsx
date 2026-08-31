"use client";

// Tiny dependency-free SVG sparkline for price trends
export function Sparkline({
  data,
  width = 96,
  height = 32,
  positive = true,
}: {
  data: number[];
  width?: number;
  height?: number;
  positive?: boolean;
}) {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);

  const points = data
    .map((v, i) => `${(i * step).toFixed(1)},${(height - 3 - ((v - min) / range) * (height - 6)).toFixed(1)}`)
    .join(" ");

  const lastX = width;
  const lastY = height - 3 - ((data[data.length - 1] - min) / range) * (height - 6);
  const firstY = height - 3 - ((data[0] - min) / range) * (height - 6);
  const color = positive ? "var(--chart-1)" : "var(--chart-3)";

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
      aria-hidden="true"
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={lastX} cy={lastY} r="2.5" fill={color} />
      <circle cx="0" cy={firstY} r="1.5" fill={color} opacity="0.4" />
    </svg>
  );
}
