import { useApp } from "../context/AppContext";
import EngineSelector from "../components/EngineSelector";

export default function ConfigPage() {
  const { config, setConfig } = useApp();

  return (
    <div className="page-layout">
      <div className="page-header">
        <h1 className="page-title">Configuration</h1>
        <p className="page-subtitle">
          Choisissez et configurez le moteur d'embedding utilisé pour le calcul de similarité.
        </p>
      </div>
      <EngineSelector config={config} onChange={setConfig} />
    </div>
  );
}
