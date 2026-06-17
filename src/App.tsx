import { NavLink, Outlet } from 'react-router-dom'
import { useApp } from './context/AppContext'
import LogPanel from './components/LogPanel'

export default function Layout() {
  const { logs, clearLogs, sidebarOpen, setSidebarOpen } = useApp()

  return (
    <div className="app">
      <nav className="app-nav">
        <div className="nav-inner">
          <span className="nav-brand">Similarité Cosinus</span>

          <div className="nav-links">
            <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              Calculer
            </NavLink>
            <NavLink to="/config" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              Configuration
            </NavLink>
            <NavLink to="/docs" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              Documentation
            </NavLink>
          </div>

          <button
            className={`sidebar-toggle-btn${sidebarOpen ? ' active' : ''}`}
            onClick={() => setSidebarOpen((v) => !v)}
            title={sidebarOpen ? 'Masquer les logs HTTP' : 'Afficher les logs HTTP'}
          >
            <span className="sidebar-toggle-icon">⇄</span>
            <span className="sidebar-toggle-label">
              Logs HTTP{logs.length > 0 && <span className="toggle-badge">{logs.length}</span>}
            </span>
          </button>
        </div>
      </nav>

      <div className="app-body">
        <main className="app-main">
          <Outlet />
        </main>

        <aside className={`app-sidebar${sidebarOpen ? ' open' : ''}`}>
          <LogPanel logs={logs} onClear={clearLogs} />
        </aside>
      </div>
    </div>
  )
}
