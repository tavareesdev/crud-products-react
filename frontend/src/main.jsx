import React from "react";
import ReactDOM from "react-dom/client";
import App from './App';

const style = document.createElement("style");
style.textContent = `
  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  input:focus, select:focus, textarea:focus { border-color: #4f46e5 !important; box-shadow: 0 0 0 3px rgba(79,70,229,0.1); }
  button { font-family: inherit; }
  button:not(:disabled):hover { opacity: 0.9; }
  button:disabled { cursor: not-allowed; }
  @keyframes spin { to { transform: rotate(360deg); } }
`;
document.head.appendChild(style);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
