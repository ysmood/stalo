import { getDevtools, devtoolsKey } from "stalo/lib/devtools";
import { eventInit, eventRecord, eventUpdate, StaloEvent } from "./types";

(async () => {
  await new Promise<void>((resolve) => {
    if (getDevtools()) resolve();
    window.addEventListener(devtoolsKey, () => {
      resolve();
    });
  });

  const devtools = getDevtools();

  if (!devtools) {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(eventInit, { detail: devtools.initRecord })
  );

  devtools.subscribe((record) => {
    window.dispatchEvent(new CustomEvent(eventRecord, { detail: record }));
  });

  window.addEventListener(eventUpdate, (e) => {
    devtools.state = JSON.parse((e as StaloEvent).detail);
  });
})();
