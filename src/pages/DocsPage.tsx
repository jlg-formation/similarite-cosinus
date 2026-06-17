import PedagogySection from '../components/PedagogySection'

export default function DocsPage() {
  return (
    <div className="page-layout">
      <div className="page-header">
        <h1 className="page-title">Documentation</h1>
        <p className="page-subtitle">
          Comprendre la similarité cosinus et son application aux embeddings vectoriels.
        </p>
      </div>
      <PedagogySection />
    </div>
  )
}
