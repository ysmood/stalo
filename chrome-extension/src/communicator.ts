import { onDevtools, encode, Devtools } from "stalo/lib/devtools";
import { initName } from "@stalo/devtools-ui/lib/constants";
import { sendMessage, setNamespace, onMessage } from "webext-bridge/window";
import {
  eventInit,
  eventRecord,
  eventSet,
  Init,
  namespace,
  Record as Rec,
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
}

function connect(d: Devtools<object>) {
  const init: Init = {
    sessionID: d.id,
    name: d.name,
    record: {
      name: initName,
      state: encode(d.state),
      createdAt: Date.now(),
    },
  };
  sendMessage(eventInit, init, "devtools");

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
