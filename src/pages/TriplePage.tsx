import { useCallback, useState } from "react";
import { useApp } from "../context/AppContext";
import { fetchEmbeddings } from "../services/embeddingService";
import { cosineSimilarity } from "../utils/cosineSimilarity";
import { TRIPLE_DEFAULTS } from "../data/defaultTexts";
import type { TripleResult } from "../types";
import PairScores from "../components/PairScores";
import TripleVisualization from "../components/TripleVisualization";

const LABELS = ["A", "B", "C"];
const PAIR_NAMES = ["A – B", "A – C", "B – C"];

export default function TriplePage() {
  const { config, addLog } = useApp();
  const [texts, setTexts] = useState<string[]>([...TRIPLE_DEFAULTS]);
  const [result, setResult] = useState<TripleResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canCompare = texts.every((t) => t.trim().length > 0) && !loading;

  const setText = (index: number, value: string) =>
    setTexts((prev) => prev.map((t, i) => (i === index ? value : t)));

  const handleCompare = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [vA, vB, vC] = await fetchEmbeddings(texts, config, addLog);
      setResult({
        vectors: [vA, vB, vC],
        scores: [cosineSimilarity(vA, vB), cosineSimilarity(vA, vC), cosineSimilarity(vB, vC)],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [texts, config, addLog]);

  return (
    <div className="home-3col">
      {/* ── Col 1 : Textes ───────────────────────────────────────────────── */}
      <section className="home-col home-col-inputs">
        <h2 className="col-panel-title">Trois textes à comparer</h2>

        <div className="col-texts">
          {LABELS.map((label, i) => (
            <label key={label} className="field-group col-text-field">
              <span className="field-label">Texte {label}</span>
              <textarea
                className="text-area col-textarea"
                value={texts[i]}
                onChange={(e) => setText(i, e.target.value)}
                placeholder="Saisissez une phrase ou un court paragraphe…"
              />
            </label>
          ))}
        </div>

        <div className="col-action">
          <button className="btn-primary btn-full" onClick={handleCompare} disabled={!canCompare}>
            {loading ? (
              <>
                <span className="spinner" /> Calcul en cours…
              </>
            ) : (
              "Calculer la similarité"
            )}
          </button>
        </div>

        {error && (
          <div className="error-banner" role="alert">
            <strong>Erreur</strong>
            <pre>{error}</pre>
          </div>
        )}
      </section>

      {/* ── Col 2 : Scores ───────────────────────────────────────────────── */}
      <section className="home-col home-col-score">
        <h2 className="col-panel-title">Scores de similarité</h2>
        <div className="col-rows">
          {result ? (
            <PairScores
              pairs={PAIR_NAMES.map((label, k) => ({ label, score: result.scores[k] }))}
            />
          ) : (
            <div className="col-placeholder">
              <span className="col-placeholder-icon">📊</span>
              <p>Les trois scores apparaîtront ici après le calcul.</p>
            </div>
          )}
        </div>
        <div className="col-action" aria-hidden="true" />
      </section>

      {/* ── Col 3 : Visualisation ─────────────────────────────────────────── */}
      <section className="home-col home-col-viz">
        <h2 className="col-panel-title">Représentation Géométrique</h2>
        <div className="col-centered col-top">
          {result ? (
            <TripleVisualization vectors={result.vectors} />
          ) : (
            <div className="col-placeholder">
              <span className="col-placeholder-icon">📐</span>
              <p>La visualisation des trois vecteurs apparaîtra ici.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
