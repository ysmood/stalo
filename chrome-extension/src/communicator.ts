import { onDevtools, encode, Devtools } from "stalo/lib/devtools";
import { initName } from "@stalo/devtools-ui/lib/constants";
import { sendMessage, setNamespace, onMessage } from "webext-bridge/window";
import {
  eventClose,
  eventInit,
  eventRecord,
  eventSet,
  Init,
  namespace,
  Record as Rec,
  SessionIDs,
  Set,
} from "./constants";

connectAll();

async function connectAll() {
  setNamespace(namespace);

  const list: Record<string, Devtools<object>> = {};

  onDevtools<object>((d) => {
    if (list[d.id]) return;

    list[d.id] = d;
    connect(d);
  });

  onMessage<Set>(eventSet, ({ data }) => {
    list[data.id].state = JSON.parse(data.state);
  });

  addEventListener("beforeunload", () => {
    sendMessage<SessionIDs>(eventClose, Object.keys(list), "devtools");
  });
}

function connect(d: Devtools<object>) {
  // For same page multiple stalo instances
  sendMessage(eventInit, createInit(d), "devtools");

  // For reconnection
  onMessage(eventInit, () => {
    sendMessage(eventInit, createInit(d), "devtools");
  });

  d.subscribe((record) => {
    const req: Rec = {
      id: d.id,
      record: {
        ...record,
        state: record.patch ? undefined : encode(record.state),
      },
    };
    sendMessage(eventRecord, req, "devtools");
  });
}

function createInit(d: Devtools<object>): Init {
  return {
    sessionID: d.id,
    name: d.name,
    record: {
      name: initName,
      state: encode(d.state),
      createdAt: Date.now(),
    },
  };
}
