import {
  allowWindowMessaging,
  sendMessage,
} from "webext-bridge/content-script";
import { eventConnect, namespace } from "./constants";

allowWindowMessaging(namespace);

(async () => {
  try {
    await sendMessage(eventConnect, null, "devtools");
  } catch {
    return; // devtools panel is not open
  }

  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("communicator.js");
  document.head.appendChild(script);
})();
