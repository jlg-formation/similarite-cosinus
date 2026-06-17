import { useState } from 'react'
import type { EngineConfig, EngineType, OpenAIModel } from '../types'
import { OPENAI_MAX_DIMENSIONS } from '../types'

interface Props {
  config: EngineConfig
  onChange: (config: EngineConfig) => void
}

const OPENAI_MODELS: OpenAIModel[] = [
  'text-embedding-ada-002',
  'text-embedding-3-small',
  'text-embedding-3-large',
]

export default function EngineSelector({ config, onChange }: Props) {
  const [showKey, setShowKey] = useState(false)

  function set(partial: Partial<EngineConfig>) {
    onChange({ ...config, ...partial })
  }

  return (
    <section className="card engine-selector">
      <h2 className="section-title">Moteur d'embedding</h2>

      <div className="engine-tabs">
        {(['lmstudio', 'openai'] as EngineType[]).map((t) => (
          <button
            key={t}
            className={`engine-tab${config.type === t ? ' active' : ''}`}
            onClick={() => set({ type: t })}
          >
            {t === 'lmstudio' ? 'LMStudio (local)' : 'OpenAI (distant)'}
          </button>
        ))}
      </div>

      {config.type === 'lmstudio' && (
        <div className="engine-fields">
          <label className="field-group">
            <span className="field-label">URL du serveur</span>
            <input
              type="url"
              className="field-input"
              value={config.lmstudioUrl}
              onChange={(e) => set({ lmstudioUrl: e.target.value })}
              placeholder="http://localhost:1234"
            />
          </label>
          <label className="field-group">
            <span className="field-label">
              Identifiant du modèle <span className="field-hint">(optionnel)</span>
            </span>
            <input
              type="text"
              className="field-input"
              value={config.lmstudioModel}
              onChange={(e) => set({ lmstudioModel: e.target.value })}
              placeholder="Laissez vide pour le modèle actif"
            />
          </label>
          <p className="field-note">
            LMStudio doit avoir <strong>CORS activé</strong> (Settings → Server → Enable CORS).
          </p>
        </div>
      )}

      {config.type === 'openai' && (
        <div className="engine-fields">
          <label className="field-group">
            <span className="field-label">Clé API</span>
            <div className="key-row">
              <input
                type={showKey ? 'text' : 'password'}
                className="field-input key-input"
                value={config.openaiKey}
                onChange={(e) => set({ openaiKey: e.target.value })}
                placeholder="sk-..."
                autoComplete="off"
              />
              <button
                className="icon-btn"
                onClick={() => setShowKey((v) => !v)}
                title={showKey ? 'Masquer' : 'Afficher'}
                type="button"
              >
                {showKey ? '🙈' : '👁'}
              </button>
            </div>
          </label>
          <label className="field-group">
            <span className="field-label">Modèle</span>
            <select
              className="field-input"
              value={config.openaiModel}
              onChange={(e) => set({ openaiModel: e.target.value as OpenAIModel, openaiDimensions: null })}
            >
              {OPENAI_MODELS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>

          {OPENAI_MAX_DIMENSIONS[config.openaiModel] !== null && (
            <label className="field-group">
              <span className="field-label">
                Dimensions{' '}
                <span className="field-hint">
                  (1 – {OPENAI_MAX_DIMENSIONS[config.openaiModel]}, défaut = max)
                </span>
              </span>
              <input
                type="number"
                className="field-input"
                min={1}
                max={OPENAI_MAX_DIMENSIONS[config.openaiModel]!}
                value={config.openaiDimensions ?? ''}
                placeholder={String(OPENAI_MAX_DIMENSIONS[config.openaiModel])}
                onChange={(e) => {
                  const v = e.target.value === '' ? null : Math.min(
                    Math.max(1, parseInt(e.target.value, 10)),
                    OPENAI_MAX_DIMENSIONS[config.openaiModel]!,
                  )
                  set({ openaiDimensions: isNaN(v as number) ? null : v })
                }}
              />
              <p className="field-note">
                Matryoshka Representation Learning — les premières dimensions concentrent l'information.
                Réduire accélère le calcul sans trop dégrader la qualité.
              </p>
            </label>
          )}

          <p className="field-note warn">
            ⚠ La clé API est stockée en <code>localStorage</code>. Toute personne ayant accès à ce
            navigateur peut la lire.
          </p>
        </div>
      )}
    </section>
  )
}
