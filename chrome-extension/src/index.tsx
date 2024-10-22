import ReactDOM from "react-dom/client";
import { onMessage, sendMessage } from "webext-bridge/devtools";
import {
  eventGet,
  eventInit,
  eventRecord,
  eventSet,
  Get,
  Init,
  Record as Rec,
  Set,
} from "./constants";
import { unplug, Connection, Panel, plug } from "@stalo/devtools-ui";

connect();
render();

function render() {
  const root = document.createElement("div");

  document.body.appendChild(root);

  ReactDOM.createRoot(root).render(<Panel chromeExtension />);
}

function connect() {
  const list: Record<string, Connection> = {};

  chrome.runtime.onConnect.addListener((port) => {
    port.onDisconnect.addListener(() => {
      Object.keys(list).forEach((id) => unplug(id));
    });
  });

  onMessage<Init>(eventInit, ({ data }) => {
    const conn: Connection = {
      id: data.sessionID,
      name: data.name,
      getState: async () => {
        const req: Get = data.sessionID;
        return await sendMessage(eventGet, req, "window");
      },
      setState: (state) => {
        const req: Set = { id: data.sessionID, state };
        sendMessage(eventSet, req, "window");
      },
    };

    plug(conn);

    conn.onInit?.(data.record);

    list[conn.id] = conn;
  });

  onMessage<Rec>(eventRecord, ({ data }) => {
    list[data.id]?.onRecord?.(data.record);
  });
}
