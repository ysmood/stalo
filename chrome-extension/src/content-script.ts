import { allowWindowMessaging } from "webext-bridge/content-script";
import { namespace } from "./constants";

allowWindowMessaging(namespace);

window.addEventListener("load", () => {
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("communicator.js");
  document.head.appendChild(script);
});
