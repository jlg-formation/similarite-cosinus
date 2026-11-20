import { projectTo2D } from "../utils/projection";

interface Props {
  vector1: number[];
  vector2: number[];
  score: number;
}

const W = 240;
const H = 240;
const CX = 120;
const CY = 124;
const R = 88; // length of displayed vectors

function toSVG(x: number, y: number): [number, number] {
  // math coords (y-up) → SVG coords (y-down)
  return [CX + x * R, CY - y * R];
}

export default function VectorVisualization({ vector1, vector2, score }: Props) {
  const [[u1x, u1y], [u2x, u2y]] = projectTo2D(vector1, vector2);

  const [ax, ay] = toSVG(u1x, u1y);
  const [bx, by] = toSVG(u2x, u2y);

  const theta = Math.acos(Math.max(-1, Math.min(1, score)));
  const arcR = 30;

  // Arc from vector1 to vector2 (the angle between them)
  const [arcStartX, arcStartY] = toSVG((u1x * arcR) / R, (u1y * arcR) / R);
  const [arcEndX, arcEndY] = toSVG((u2x * arcR) / R, (u2y * arcR) / R);
  const largeArc = theta > Math.PI ? 1 : 0;

  // Angle label position (bisector)
  const bisX = u1x + u2x;
  const bisY = u1y + u2y;
  const bisNorm = Math.sqrt(bisX * bisX + bisY * bisY) || 1;
  const labelR = arcR + 14;
  const [lblX, lblY] = toSVG((bisX / bisNorm) * (labelR / R), (bisY / bisNorm) * (labelR / R));

  const angleDeg = (theta * 180) / Math.PI;

  return (
    <div className="vec-viz-wrap">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ maxWidth: W, display: "block", margin: "0 auto" }}
        aria-label="Représentation géométrique des deux vecteurs"
      >
        <defs>
          <marker id="arrow-a" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#3b82f6" />
          </marker>
          <marker id="arrow-b" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#f97316" />
          </marker>
        </defs>

        {/* Axes */}
        <line x1={CX - R - 8} y1={CY} x2={CX + R + 8} y2={CY} stroke="#e2e8f0" strokeWidth="1" />
        <line x1={CX} y1={CY + R + 8} x2={CX} y2={CY - R - 8} stroke="#e2e8f0" strokeWidth="1" />

        {/* Unit circle (reference) */}
        <circle
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        {/* Angle arc */}
        {theta > 0.01 && (
          <>
            <path
              d={`M ${arcStartX} ${arcStartY} A ${arcR} ${arcR} 0 ${largeArc} 0 ${arcEndX} ${arcEndY}`}
              fill="none"
              stroke="#a855f7"
              strokeWidth="1.5"
              strokeDasharray="3 2"
            />
            <text
              x={lblX}
              y={lblY}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="13"
              fill="#a855f7"
              fontFamily="system-ui, sans-serif"
            >
              {angleDeg.toFixed(1)}°
            </text>
          </>
        )}

        {/* Vector 1 */}
        <line
          x1={CX}
          y1={CY}
          x2={ax}
          y2={ay}
          stroke="#3b82f6"
          strokeWidth="2.5"
          markerEnd="url(#arrow-a)"
        />
        <text
          x={ax + (ax > CX ? 8 : -8)}
          y={ay + (ay < CY ? -6 : 6)}
          textAnchor={ax > CX ? "start" : "end"}
          fontSize="15"
          fontWeight="700"
          fill="#3b82f6"
          fontFamily="system-ui, sans-serif"
        >
          T₁
        </text>

        {/* Vector 2 */}
        <line
          x1={CX}
          y1={CY}
          x2={bx}
          y2={by}
          stroke="#f97316"
          strokeWidth="2.5"
          markerEnd="url(#arrow-b)"
        />
        <text
          x={bx + (bx > CX ? 8 : -8)}
          y={by + (by < CY ? -6 : 6)}
          textAnchor={bx > CX ? "start" : "end"}
          fontSize="15"
          fontWeight="700"
          fill="#f97316"
          fontFamily="system-ui, sans-serif"
        >
          T₂
        </text>

        {/* Origin */}
        <circle cx={CX} cy={CY} r="4" fill="#1e293b" />
        <text
          x={CX - 8}
          y={CY + 14}
          fontSize="13"
          fill="#4a5568"
          fontFamily="system-ui, sans-serif"
        >
          O
        </text>
      </svg>
      <p className="vec-caption">
        Projection des embeddings sur le plan qu'ils définissent. L'angle entre les vecteurs est{" "}
        <strong>{angleDeg.toFixed(1)}°</strong>.
      </p>
    </div>
  );
}
