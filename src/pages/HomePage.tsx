import { useApp } from "../context/AppContext";
import Gauge from "../components/Gauge";
import VectorVisualization from "../components/VectorVisualization";

function ColPlaceholder({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="col-placeholder">
      <span className="col-placeholder-icon">{icon}</span>
      <p>{text}</p>
    </div>
  );
}

export default function HomePage() {
  const { text1, text2, setText1, setText2, result, loading, error, handleCalculate } = useApp();
  const canCalculate = text1.trim().length > 0 && text2.trim().length > 0 && !loading;

  return (
    <div className="home-3col">
      {/* ── Col 1 : Textes ───────────────────────────────────────────────── */}
      <section className="home-col home-col-inputs">
        <h2 className="col-panel-title">Textes à comparer</h2>

        <div className="col-texts">
          <label className="field-group col-text-field">
            <span className="field-label">Texte 1</span>
            <textarea
              className="text-area col-textarea"
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              placeholder="Saisissez une phrase ou un court paragraphe…"
            />
          </label>
          <label className="field-group col-text-field">
            <span className="field-label">Texte 2</span>
            <textarea
              className="text-area col-textarea"
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              placeholder="Saisissez une phrase ou un court paragraphe…"
            />
          </label>
        </div>

        <button className="btn-primary btn-full" onClick={handleCalculate} disabled={!canCalculate}>
          {loading ? (
            <>
              <span className="spinner" /> Calcul en cours…
            </>
          ) : (
            "Calculer la similarité"
          )}
        </button>

        {error && (
          <div className="error-banner" role="alert">
            <strong>Erreur</strong>
            <pre>{error}</pre>
          </div>
        )}
      </section>

      {/* ── Col 2 : Score ────────────────────────────────────────────────── */}
      <section className="home-col home-col-score">
        <h2 className="col-panel-title">Score Cosinus</h2>
        <div className="col-centered">
          {result ? (
            <>
              <Gauge score={result.score} />
              <p className="dim-note">{result.vector1.length} dimensions</p>
            </>
          ) : (
            <ColPlaceholder
              icon="📊"
              text="Le score de similarité apparaîtra ici après le calcul."
            />
          )}
        </div>
      </section>

      {/* ── Col 3 : Visualisation ─────────────────────────────────────────── */}
      <section className="home-col home-col-viz">
        <h2 className="col-panel-title">Représentation Géométrique</h2>
        <div className="col-centered">
          {result ? (
            <VectorVisualization
              vector1={result.vector1}
              vector2={result.vector2}
              score={result.score}
            />
          ) : (
            <ColPlaceholder icon="📐" text="La visualisation vectorielle apparaîtra ici." />
          )}
        </div>
      </section>
    </div>
  );
}
