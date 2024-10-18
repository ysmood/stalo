import { css, cx } from "@emotion/css";
import {
  selectRecord,
  useHistoryIDs,
  useRecord,
  useSelected,
  useTimeDiff,
} from "./store";
import { Name, Title } from "./Components";

export default function History() {
  return (
    <div className={style}>
      <Title className="title border-bottom" text="History" />
      <div>
        {useHistoryIDs().map((id) => {
          return <Item key={id} id={id} />;
        })}
      </div>
    </div>
  );
}

function Item({ id }: { id: number }) {
  const rec = useRecord(id);

  return (
    <div
      className={cx("item", "border-bottom", {
        selected: useSelected() === id,
      })}
      onClick={() => selectRecord(id)}
    >
      <div className="line title">
        <Name className="name" name={rec.name} />
        <TimeDiff duration={useTimeDiff(id)} />
        <div className="id">{id}</div>
      </div>
      <div className="line light">
        {rec.description === undefined ? NoDescription() : rec.description}
      </div>
    </div>
  );
}

function TimeDiff({ duration }: { duration: number }) {
  if (duration === 0) return null;

  duration = Math.abs(duration);

  const sec = duration / 1000;
  const min = Math.floor(sec / 60);
  const hrs = Math.floor(min / 60);

  return (
    <div>
      {duration < 0 ? "-" : "+"}
      {hrs > 0 ? <span>{hrs}h</span> : null}
      {min > 0 ? <span className="min">{min % 60}m</span> : null}
      <span>{(sec % 60).toFixed(2)}s</span>
    </div>
  );
}

function NoDescription() {
  return <span className="no-desc">No description</span>;
}

const style = css({
  label: "History",
  height: "100%",
  overflowY: "scroll",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
  gridArea: "history",

  ".border-bottom": {
    borderBottom: "1px solid #3c3c3c",
  },

  ".title": {
    padding: 10,
  },

  ".item": {
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: 5,
    padding: "5px 0",

    "&:hover, &.selected": {
      background: "#3c3c3c",
    },

    ".line": {
      padding: "0 10px",
    },

    ".light": {
      color: "#ccc",
      fontSize: 10,
    },

    ".title": {
      alignItems: "center",
      display: "flex",
      gap: 10,
      color: "#ccc",

      ".min": {
        color: "#d84685",
      },
    },

    ".name": {
      flex: 1,
    },

    ".no-desc": {
      color: "#777",
    },
  },
});
