import { getDevtools, devtoolsKey, Devtools } from "stalo/lib/devtools";
import { initName } from "@stalo/devtools-ui";
import { sendMessage, setNamespace, onMessage } from "webext-bridge/window";
import {
  eventGet,
  eventInit,
  eventRecord,
  eventSet,
  Get,
  Init,
  namespace,
  Record as Rec,
  Set,
} from "./constants";
import { uid } from "stalo/lib/utils";

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

  window.addEventListener(devtoolsKey, () => {
    updateList();
  });

  setInterval(updateList, 1000);

  onMessage<Get>(eventGet, ({ data }) => {
    return list[data].state;
  });

  onMessage<Set>(eventSet, ({ data }) => {
    list[data.id].state = data.state;
  });
}

function connect(d: Devtools<object>) {
  const init: Init = {
    sessionID: d.id,
    name: d.name,
    record: {
      id: uid(),
      name: initName,
      description: "Initial state when devtools is opened",
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
