import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import Layout from "./App";
import { AppProvider } from "./context/AppContext";
import HomePage from "./pages/HomePage";
import ConfigPage from "./pages/ConfigPage";
import DocsPage from "./pages/DocsPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="config" element={<ConfigPage />} />
            <Route path="docs" element={<DocsPage />} />
          </Route>
        </Routes>
      </AppProvider>
    </HashRouter>
  </StrictMode>,
);
