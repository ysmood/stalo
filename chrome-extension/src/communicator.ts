import { getDevtools, devtoolsKey } from "stalo/lib/devtools";
import { eventInit, eventRecord, eventUpdate, StaloEvent } from "./types";

(async function connect() {
  await new Promise<void>((resolve) => {
    if (getDevtools()) resolve();
    window.addEventListener(devtoolsKey, () => {
      resolve();
    });
  });

  const list = getDevtools();

  if (!list) {
    return;
  }

  list.forEach((devtools, i) => {
    window.dispatchEvent(
      new CustomEvent(eventInit, {
        detail: [i, devtools.name, devtools.initRecord],
      })
    );

    devtools.subscribe((record) => {
      window.dispatchEvent(
        new CustomEvent(eventRecord, { detail: [i, record] })
      );
    });
  });

  window.addEventListener(eventUpdate, (e) => {
    const [i, state] = (e as StaloEvent).detail;
    list[i].state = JSON.parse(state);
  });
})();
