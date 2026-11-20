interface Props {
  score: number;
}

const W = 320;
const H = 188;
const CX = 160;
const CY = 136;
const R = 96;
const NEEDLE_R = 83;

function polarToSVG(angle: number, r: number): [number, number] {
  // angle in radians, measured from positive x-axis, y-up convention → SVG (y-down)
  return [CX + r * Math.cos(angle), CY - r * Math.sin(angle)];
}

function scoreToAngle(score: number): number {
  // score in [-1, 1] → angle in [π, 0] (left to right, upper semicircle)
  return (Math.PI * (1 - score)) / 2;
}

const TICKS = [-1, -0.5, 0, 0.5, 1];

export default function Gauge({ score: rawScore }: Props) {
  const score = Math.max(-1, Math.min(1, rawScore));
  const angle = scoreToAngle(score);
  const [nx, ny] = polarToSVG(angle, NEEDLE_R);

  // Color: linear interpolation red→yellow→green mapped to score -1→0→1
  function scoreToColor(s: number): string {
    if (s <= 0) {
      const t = (s + 1) / 1; // 0..1 from -1..0
      const r = Math.round(239 * 1 + (234 - 239) * t); // 239→234
      const g = Math.round(68 * (1 - t) + 179 * t); // 68→179
      return `rgb(${r},${g},30)`;
    } else {
      const t = s; // 0..1
      const r = Math.round(234 * (1 - t) + 34 * t);
      const g = Math.round(179 * (1 - t) + 197 * t);
      return `rgb(${r},${g},30)`;
    }
  }

  const needleColor = scoreToColor(score);

  // Label
  const label =
    score > 0.8
      ? "Très similaires"
      : score > 0.5
        ? "Similaires"
        : score > 0.2
          ? "Quelque peu liés"
          : score > -0.2
            ? "Peu liés"
            : score > -0.5
              ? "Dissemblables"
              : "Opposés";

  return (
    <div className="gauge-wrap">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ maxWidth: W, display: "block", margin: "0 auto" }}
        aria-label={`Score de similarité : ${score.toFixed(3)}`}
      >
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>

        {/* Background arc */}
        <path
          d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 0 ${CX + R} ${CY}`}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="14"
          strokeLinecap="butt"
        />

        {/* Colored arc */}
        <path
          d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 0 ${CX + R} ${CY}`}
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth="10"
          strokeLinecap="butt"
        />

        {/* Endpoint dots */}
        <circle cx={CX - R} cy={CY} r="11" fill="#ef4444" />
        <circle cx={CX + R} cy={CY} r="11" fill="#22c55e" />

        {/* Tick marks */}
        {TICKS.map((t) => {
          const a = scoreToAngle(t);
          const [ox, oy] = polarToSVG(a, R + 3);
          const [ix, iy] = polarToSVG(a, R - 9);
          const [lx, ly] = polarToSVG(a, R + 17);
          return (
            <g key={t}>
              <line x1={ox} y1={oy} x2={ix} y2={iy} stroke="#64748b" strokeWidth="1.5" />
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="13"
                fill="#4a5568"
                fontFamily="system-ui, sans-serif"
              >
                {t}
              </text>
            </g>
          );
        })}

        {/* Needle */}
        <line
          x1={CX}
          y1={CY}
          x2={nx}
          y2={ny}
          stroke={needleColor}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx={CX} cy={CY} r="6" fill={needleColor} />
        <circle cx={CX} cy={CY} r="3" fill="white" />

        {/* Score value */}
        <text
          x={CX}
          y={CY + 26}
          textAnchor="middle"
          fontSize="26"
          fontWeight="700"
          fill={needleColor}
          fontFamily="system-ui, sans-serif"
        >
          {score.toFixed(4)}
        </text>
        <text
          x={CX}
          y={CY + 44}
          textAnchor="middle"
          fontSize="14"
          fill="#4a5568"
          fontFamily="system-ui, sans-serif"
        >
          {label}
        </text>
      </svg>
    </div>
  );
}
