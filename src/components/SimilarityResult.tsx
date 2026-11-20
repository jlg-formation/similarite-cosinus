import type { ComputeResult } from "../types";
import Gauge from "./Gauge";
import VectorVisualization from "./VectorVisualization";

interface Props {
  result: ComputeResult;
}

export default function SimilarityResult({ result }: Props) {
  const { score, vector1, vector2 } = result;
  const dim = vector1.length;

  return (
    <section className="card result-section">
      <h2 className="section-title">Résultat</h2>
      <p className="dim-info">
        Dimension des vecteurs : <strong>{dim}</strong>
      </p>

      <div className="result-grid">
        <div className="result-col">
          <h3 className="col-title">Score cosinus</h3>
          <Gauge score={score} />
        </div>
        <div className="result-col">
          <h3 className="col-title">Représentation géométrique</h3>
          <VectorVisualization vector1={vector1} vector2={vector2} score={score} />
        </div>
      </div>
    </section>
  );
}
