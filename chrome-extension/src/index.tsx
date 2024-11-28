import ReactDOM from "react-dom/client";
import { onMessage, sendMessage } from "webext-bridge/devtools";
import {
  eventClose,
  eventConnect,
  eventInit,
  eventRecord,
  eventSet,
  Init,
  Record as Rec,
  SessionIDs,
  Set,
} from "./constants";
import { Connection, Panel, plug, unplug } from "@stalo/devtools-ui";

main();

function main() {
  connect();

  const root = document.createElement("div");

  document.body.appendChild(root);

  ReactDOM.createRoot(root).render(<Panel customConnect />);
}

function connect() {
  const list: Record<string, Connection> = {};

  sendMessage(eventInit, null, "window");

  // Just acknowledge connection don't need to do anything
  onMessage(eventConnect, () => {});

  onMessage<Init>(eventInit, ({ data }) => {
    const conn: Connection = {
      id: data.sessionID,
      name: data.name,
      setState: (state) => {
        const req: Set = { id: data.sessionID, state };
        sendMessage(eventSet, req, "window");
      },
    };

    plug(conn);

    conn.onInit?.(data.record);

    if (!list[conn.id]) list[conn.id] = conn;
  });

  onMessage<Rec>(eventRecord, ({ data }) => {
    list[data.id]?.onRecord?.(data.record);
  });

  onMessage<SessionIDs>(eventClose, ({ data }) => {
    data.forEach((id) => unplug(id));
  });
}
