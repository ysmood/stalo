import { css } from "@emotion/css";
import Staging from "./Staging";
import History from "./History";
import { CurrentRecord } from "./RecordDetails";

export default function Panel() {
  return (
    <div className={style}>
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
  fontFamily: "Arial, sans-serif",
  fontSize: 12,
  backgroundColor: "#282828",

  "h1, h2, h3": {
    fontWeight: "lighter",
  },
});
