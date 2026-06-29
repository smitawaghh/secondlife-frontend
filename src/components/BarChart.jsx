export default function BarChart({ points = [] }) {
  if (!points.length) {
    return <div className="muted" style={{ padding: "20px 0", textAlign: "center" }}>No data yet.</div>;
  }

  const W = 1000;
  const H = 240;
  const padT = 28;
  const padB = 44;
  const padX = 20;

  const max = Math.max(...points.map((p) => p.value), 1);
  const colW = (W - padX * 2) / points.length;
  const barW = Math.min(colW * 0.55, 90);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      {/* Baseline */}
      <line
        x1={padX}
        y1={H - padB}
        x2={W - padX}
        y2={H - padB}
        stroke="rgba(15,31,20,0.10)"
        strokeWidth="1.5"
      />

      {points.map((p, i) => {
        const barH = Math.max(4, Math.round(((p.value / max) * (H - padT - padB))));
        const cx = padX + colW * i + colW / 2;
        const x = cx - barW / 2;
        const y = H - padB - barH;

        return (
          <g key={p.label + i}>
            <rect
              x={x}
              y={y}
              width={barW}
              height={barH}
              rx="8"
              fill="rgba(31,138,76,0.18)"
              stroke="rgba(31,138,76,0.35)"
              strokeWidth="1"
            />
            <text
              x={cx}
              y={y - 8}
              textAnchor="middle"
              fill="rgba(15,31,20,0.80)"
              fontSize="15"
              fontWeight="900"
            >
              {p.value}
            </text>
            <text
              x={cx}
              y={H - padB + 18}
              textAnchor="middle"
              fill="rgba(15,31,20,0.55)"
              fontSize="13"
              fontWeight="800"
            >
              {String(p.label).replaceAll("_", " ")}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
