import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import SiteShell from "./SiteShell.tsx";
import InstitutionalPage from "./components/InstitutionalPages.tsx";

const path = window.location.pathname.replace(/\/+$/, "") || "/";
const institutionalPages: Record<string, "sobre" | "privacidade" | "cookies" | "termos"> = {
  "/sobre": "sobre",
  "/privacidade": "privacidade",
  "/cookies": "cookies",
  "/termos": "termos",
};

const page = institutionalPages[path];

ReactDOM.createRoot(document.getElementById("root")!).render(
  page ? <InstitutionalPage page={page} /> : <SiteShell />
);
