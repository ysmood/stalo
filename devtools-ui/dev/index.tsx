import ReactDOM from "react-dom/client";
import connect from "../src/connect";
import { App } from "./Components";
import { StrictMode } from "react";

connect();

setup();

function setup() {
  const root = document.createElement("div");

  document.body.appendChild(root);

  ReactDOM.createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
