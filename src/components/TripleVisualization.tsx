import { pcaProject2D } from "../utils/pca";

interface Props {
  vectors: number[][];
}

const W = 240;
const CX = 120;
const CY = 120;
const R = 88;
const COLORS = ["#3b82f6", "#f97316", "#22c55e"];
const NAMES = ["T₁", "T₂", "T₃"];

export default function TripleVisualization({ vectors }: Props) {
  const points = pcaProject2D(vectors).map((p) => ({ x: CX + p.x * R, y: CY - p.y * R }));

  return (
    <div className="vec-viz-wrap">
      <svg
        viewBox={`0 0 ${W} ${W}`}
        width="100%"
        style={{ maxWidth: W, display: "block", margin: "0 auto" }}
        aria-label="Représentation géométrique des trois vecteurs"
      >
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="#e2e8f0" strokeDasharray="4 4" />
        {points.map((p, i) => (
          <g key={NAMES[i]}>
            <line x1={CX} y1={CY} x2={p.x} y2={p.y} stroke={COLORS[i]} strokeWidth="2.5" />
            <circle cx={p.x} cy={p.y} r="5" fill={COLORS[i]} />
            <text
              x={p.x + (p.x > CX ? 8 : -8)}
              y={p.y + (p.y < CY ? -6 : 6)}
              textAnchor={p.x > CX ? "start" : "end"}
              fontSize="14"
              fontWeight="700"
              fill={COLORS[i]}
              fontFamily="system-ui, sans-serif"
            >
              {NAMES[i]}
            </text>
          </g>
        ))}
        <circle cx={CX} cy={CY} r="4" fill="#1e293b" />
      </svg>
      <p className="dim-note">
        Projection approximative (
        <a
          href="https://fr.wikipedia.org/wiki/Analyse_en_composantes_principales"
          target="_blank"
          rel="noopener noreferrer"
        >
          PCA
        </a>{" "}
        2D) : les scores sont exacts.
      </p>
    </div>
  );
}
