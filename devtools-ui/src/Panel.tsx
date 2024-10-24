import "./global-css";
import { css } from "@emotion/css";
import Staging from "./Staging";
import History from "./History";
import { CurrentRecord } from "./CurrentRecord";
import connect from "./connect";
import { useEffect } from "react";

export default function Panel({
  chromeExtension,
  width,
  height,
}: {
  chromeExtension?: boolean;
  width?: number;
  height?: number;
}) {
  useEffect(() => {
    if (!chromeExtension) {
      const stop = new AbortController();
      connect(stop.signal);
      return () => stop.abort();
    }
  }, [chromeExtension]);

  return (
    <div className={style} style={{ width, height }}>
      <History />
      <CurrentRecord />
      <Staging />
    </div>
  );
}

const style = css({
  label: "Panel",

  display: "grid",
  gridTemplateColumns: "300px 1fr",
  gridTemplateRows: "auto 1fr",
  gridTemplateAreas: `
    "history record-details"
    "history staging"
  `,

  gap: 10,
  height: "100%",
  color: "#fff",
  fontFamily: "Roboto, sans-serif",
  fontSize: 12,
  backgroundColor: "#282828",

  "h1, h2, h3": {
    fontWeight: "lighter",
  },
});
