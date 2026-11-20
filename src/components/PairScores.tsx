import { similarityLabel } from "../utils/similarityLabel";

interface Pair {
  label: string;
  score: number;
}

interface Props {
  pairs: Pair[];
}

export default function PairScores({ pairs }: Props) {
  return (
    <ul className="pair-scores">
      {pairs.map(({ label, score }) => {
        const clamped = Math.max(-1, Math.min(1, score));
        const angle = (Math.acos(clamped) * 180) / Math.PI;
        return (
          <li key={label} className="pair-row">
            <span className="pair-name">{label}</span>
            <div className="pair-card">
              <div className="pair-card-head">
                <span>{angle.toFixed(1)}°</span>
              </div>
              <div className="pair-card-score">{score.toFixed(4)}</div>
              <div className="pair-card-verdict">{similarityLabel(score)}</div>
              <div className="pair-bar" aria-hidden="true">
                <span
                  className="pair-bar-marker"
                  style={{ left: `${((clamped + 1) / 2) * 100}%` }}
                />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
