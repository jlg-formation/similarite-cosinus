interface Props {
  text1: string;
  text2: string;
  onText1Change: (v: string) => void;
  onText2Change: (v: string) => void;
  onCalculate: () => void;
  loading: boolean;
  rows?: number;
}

export default function TextInputs({
  text1,
  text2,
  onText1Change,
  onText2Change,
  onCalculate,
  loading,
  rows = 5,
}: Props) {
  const canCalculate = text1.trim().length > 0 && text2.trim().length > 0 && !loading;

  return (
    <section className="card text-inputs-section">
      <h2 className="section-title">Textes à comparer</h2>

      <div className="texts-grid">
        <label className="field-group">
          <span className="field-label">Texte 1</span>
          <textarea
            className="text-area"
            value={text1}
            onChange={(e) => onText1Change(e.target.value)}
            placeholder="Saisissez une phrase ou un court paragraphe…"
            rows={rows}
          />
        </label>
        <label className="field-group">
          <span className="field-label">Texte 2</span>
          <textarea
            className="text-area"
            value={text2}
            onChange={(e) => onText2Change(e.target.value)}
            placeholder="Saisissez une phrase ou un court paragraphe…"
            rows={rows}
          />
        </label>
      </div>

      <div className="calculate-row">
        <button className="btn-primary" onClick={onCalculate} disabled={!canCalculate}>
          {loading ? (
            <>
              <span className="spinner" /> Calcul en cours…
            </>
          ) : (
            "Calculer la similarité"
          )}
        </button>
      </div>
    </section>
  );
}
