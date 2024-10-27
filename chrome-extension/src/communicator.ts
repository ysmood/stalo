import { getDevtools, DEVTOOLS, Devtools } from "stalo/lib/devtools";
import { initName } from "@stalo/devtools-ui";
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

  function updateList() {
    getDevtools<object>().forEach((d) => {
      if (list[d.id]) return;

      list[d.id] = d;
      connect(d);
    });
  }

  window.addEventListener(DEVTOOLS, () => {
    updateList();
  });

  setInterval(updateList, 1000);

  onMessage<Set>(eventSet, ({ data }) => {
    list[data.id].state = data.state;
  });
}

function connect(d: Devtools<object>) {
  const init: Init = {
    sessionID: d.id,
    name: d.name,
    record: {
      name: initName,
      state: d.state,
      createdAt: Date.now(),
    },
  };
  sendMessage(eventInit, init, "devtools");

  d.subscribe((record) => {
    const req: Rec = { id: d.id, record };
    sendMessage(eventRecord, req, "devtools");
  });
}
