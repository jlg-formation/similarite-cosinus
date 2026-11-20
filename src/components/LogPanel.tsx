import { useState } from "react";
import type { HttpLog } from "../types";

/* ── JSON Tree ────────────────────────────────────────────────────────────── */

function PrimitiveValue({ value }: { value: unknown }) {
  if (value === null) return <span className="jv-null">null</span>;
  if (typeof value === "boolean") return <span className="jv-bool">{String(value)}</span>;
  if (typeof value === "number") return <span className="jv-num">{value}</span>;
  if (typeof value === "string") {
    const s = value.length > 120 ? value.slice(0, 120) + "…" : value;
    return <span className="jv-str">"{s}"</span>;
  }
  return <span className="jv-null">undefined</span>;
}

function JsonNode({ data, depth = 0 }: { data: unknown; depth?: number }) {
  // Auto-collapse nodes at depth ≥ 2 (keeps embedding arrays collapsed by default)
  const [open, setOpen] = useState(depth < 2);

  if (data === null || typeof data !== "object") {
    return <PrimitiveValue value={data} />;
  }

  const isArr = Array.isArray(data);
  const entries: [string, unknown][] = isArr
    ? (data as unknown[]).map((v, i) => [String(i), v])
    : Object.entries(data as Record<string, unknown>);

  const ob = isArr ? "[" : "{";
  const cb = isArr ? "]" : "}";

  if (entries.length === 0) {
    return (
      <span className="jv-bracket">
        {ob}
        {cb}
      </span>
    );
  }

  const summary = isArr
    ? `${entries.length} élément${entries.length > 1 ? "s" : ""}`
    : `${entries.length} prop${entries.length > 1 ? "s" : ""}`;

  return (
    <>
      <button
        className="jv-toggle"
        onClick={() => setOpen((o) => !o)}
        title={open ? "Réduire" : "Développer"}
      >
        {open ? "▽" : "▷"}
      </button>
      <span className="jv-bracket">{ob}</span>

      {open ? (
        <>
          <div className="jv-children">
            {entries.map(([key, val], i) => (
              <div key={key} className="jv-row">
                {!isArr && (
                  <>
                    <span className="jv-key">"{key}"</span>
                    <span className="jv-colon">: </span>
                  </>
                )}
                <JsonNode data={val} depth={depth + 1} />
                {i < entries.length - 1 && <span className="jv-comma">,</span>}
              </div>
            ))}
          </div>
          <span className="jv-bracket">{cb}</span>
        </>
      ) : (
        <>
          {" "}
          <span className="jv-summary" onClick={() => setOpen(true)}>
            {summary}
          </span>{" "}
          <span className="jv-bracket">{cb}</span>
        </>
      )}
    </>
  );
}

function JsonBlock({ value }: { value: unknown }) {
  return (
    <div className="jv-root">
      <JsonNode data={value} depth={0} />
    </div>
  );
}

/* ── Log entries ──────────────────────────────────────────────────────────── */

function LogEntry({ log }: { log: HttpLog }) {
  const [open, setOpen] = useState(true);

  return (
    <div className={`log-entry${log.error ? " log-error" : ""}`}>
      <button className="log-header" onClick={() => setOpen((v) => !v)}>
        <span className="log-id">#{log.id}</span>
        <span className="log-engine">{log.engine}</span>
        <span className={`log-status${log.error ? " error" : " ok"}`}>{log.error ? "✗" : "✓"}</span>
        <span className="log-chevron">{open ? "▲" : "▼"}</span>
      </button>
      <div className="log-time-row">
        {log.timestamp.replace("T", " ").replace("Z", "").slice(0, 19)}
      </div>

      {open && (
        <div className="log-body">
          <div className="log-section">
            <div className="log-section-title">Requête</div>
            <div className="log-url">
              <code>POST {log.request.url}</code>
            </div>
            <JsonBlock value={log.request.body} />
          </div>

          {log.response !== undefined && (
            <div className="log-section">
              <div className="log-section-title">Réponse</div>
              <JsonBlock value={log.response} />
            </div>
          )}

          {log.error && (
            <div className="log-section">
              <div className="log-section-title error-title">Erreur</div>
              <pre className="error-pre">{log.error}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Panel ────────────────────────────────────────────────────────────────── */

interface Props {
  logs: HttpLog[];
  onClear: () => void;
}

export default function LogPanel({ logs, onClear }: Props) {
  return (
    <div className="log-panel-sidebar">
      <div className="log-panel-top">
        <span className="log-panel-heading">Échanges HTTP</span>
        {logs.length > 0 && (
          <button className="btn-ghost" onClick={onClear}>
            Effacer
          </button>
        )}
      </div>

      <div className="log-list">
        {logs.length === 0 ? (
          <p className="log-empty">Les échanges HTTP apparaîtront ici après chaque calcul.</p>
        ) : (
          logs.slice(-1).map((log) => <LogEntry key={log.id} log={log} />)
        )}
      </div>
    </div>
  );
}
