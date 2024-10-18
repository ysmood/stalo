import { sendMessage, onMessage } from "webext-bridge/content-script";
import { StaloEvent, eventInit, eventRecord, eventUpdate } from "./types";

(() => {
  window.addEventListener(eventInit, (e) => {
    sendMessage(eventInit, (e as StaloEvent).detail, "devtools");
  });

  window.addEventListener(eventRecord, (e) => {
    sendMessage(eventRecord, (e as StaloEvent).detail, "devtools");
  });

  onMessage(eventUpdate, ({ data }) => {
    const event = new CustomEvent(eventUpdate, { detail: data });
    window.dispatchEvent(event);
  });

  window.addEventListener("load", () => {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("communicator.js");
    document.head.appendChild(script);
  });
})();
