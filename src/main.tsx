// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Estilos globales
import "./index.css";      // Tailwind + tema Manus
import "./App.css";        // Estilos de la app
import "./styles/map.css"; // Estilos específicos del mapa

// Aseguramos modo dark en el <html>, por si acaso
if (!document.documentElement.classList.contains("dark")) {
  document.documentElement.classList.add("dark");
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("No se ha encontrado el elemento #root en index.html");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
