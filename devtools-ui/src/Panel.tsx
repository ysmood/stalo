import "./global-css";
import { css } from "@emotion/css";
import Staging from "./Staging";
import History from "./History";
import { CurrentRecord } from "./CurrentRecord";
import connect from "./store/connect";
import { useEffect } from "react";

export default function Panel({
  width,
  height,
  customConnect,
}: {
  width?: number;
  height?: number;
  customConnect?: boolean;
}) {
  useEffect(() => {
    if (customConnect) return;
    const stop = new AbortController();
    connect(stop.signal);
    return () => stop.abort();
  }, [customConnect]);

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
  gridTemplateColumns: "320px minmax(400px, 1fr)",
  gridTemplateRows: "auto 1fr",
  gridTemplateAreas: `
    "history record-details"
    "history staging"
  `,

  gap: 10,
  height: "100%",
  overflow: "scroll",
  color: "#fff",
  fontFamily: "Roboto, sans-serif",
  fontSize: 12,
  backgroundColor: "#282828",

  "h1, h2, h3": {
    fontWeight: "lighter",
  },
});
