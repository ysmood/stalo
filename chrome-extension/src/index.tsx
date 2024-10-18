import ReactDOM from "react-dom/client";
import { onMessage, sendMessage } from "webext-bridge/devtools";
import { eventInit, eventRecord, eventUpdate } from "./types";
import { Record } from "stalo/lib/devtools";
import { plug, Connection, Panel } from "@stalo/devtools-ui";

connect();

const root = document.createElement("div");

document.body.appendChild(root);

ReactDOM.createRoot(root).render(<Panel />);

function connect() {
  const conn: Connection = {
    setState(json) {
      sendMessage(eventUpdate, json, "content-script");
    },
  };

  plug(conn);

  onMessage(eventInit, async ({ data }) => {
    conn.onInit?.(data as Record<unknown>);
  });

  onMessage(eventRecord, async ({ data }) => {
    conn.onRecord?.(data as Record<unknown>);
  });
}
