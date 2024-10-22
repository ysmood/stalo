import ReactDOM from "react-dom/client";
import { App } from "./Components";
import { StrictMode } from "react";

const root = document.createElement("div");

document.body.appendChild(root);

ReactDOM.createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);
