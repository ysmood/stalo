import ReactDOM from "react-dom/client";
import { onMessage, sendMessage } from "webext-bridge/devtools";
import { eventInit, eventRecord, eventUpdate } from "./types";
import { Record } from "stalo/lib/devtools";
import { unplug, plug, Connection, Panel } from "@stalo/devtools-ui";

connect();

const root = document.createElement("div");

document.body.appendChild(root);

ReactDOM.createRoot(root).render(<Panel />);

function connect() {
  const list: Connection[] = [];

  chrome.runtime.onConnect.addListener((port) => {
    port.onDisconnect.addListener(() => {
      list.forEach((_, id) => {
        unplug(id);
      });
    });
  });

  onMessage(eventInit, async ({ data }) => {
    const [id, name, rec] = data as unknown as [
      number,
      string,
      Record<unknown>
    ];

    const conn: Connection = {
      id,
      name,
      setState(json) {
        sendMessage(eventUpdate, [id, json], "content-script");
      },
    };

    list[id] = conn;

    plug(conn);

    conn.onInit?.(rec);
  });

  onMessage(eventRecord, async ({ data }) => {
    const [id, rec] = data as unknown as [number, Record<unknown>];
    list[id].onRecord?.(rec);
  });
}
