import { css, cx } from "@emotion/css";
import { Name, Time } from "./Components";
import { useRecord, useSelected } from "./store/history";
import { LuClock } from "react-icons/lu";
import { TfiCommentAlt } from "react-icons/tfi";
import { VscSymbolNumeric } from "react-icons/vsc";
import { CiAt } from "react-icons/ci";

export function CurrentRecord() {
  const id = useSelected();
  const { rec: record } = useRecord(id);

  return (
    <div className={cx(style, "info")}>
      <div className="first-row">
        <div title="ID of the record" className="id">
          <VscSymbolNumeric /> <code>{id}</code>
        </div>
        <div className="name">
          <CiAt size={14} /> <Name name={record.name} />
        </div>
        <div className="time">
          <LuClock /> <Time time={record.createdAt} />
        </div>
      </div>
      <div>
        <div style={{ width: 18 }}>
          <TfiCommentAlt size={14} />
        </div>
        <div className="desc">
          {record.description || <span>No description</span>}
        </div>
      </div>
    </div>
  );
}

const style = css({
  label: "record-details",
  gridArea: "record-details",
  paddingTop: 10,
  color: "#aaa",

  div: {
    display: "flex",
    gap: 3,
    alignItems: "center",
  },

  ".first-row": {
    gap: 10,
    height: "2em",
    overflowY: "scroll",
  },

  ".id": {
    color: "#eee",
  },

  ".name": {
    svg: {
      minWidth: "1em",
    },
  },

  ".time": {
    minWidth: "13em",
  },

  ".desc": {
    color: "#ddd",
    marginLeft: 4,
    height: "3em",
    overflowY: "scroll",
    flex: 1,

    span: {
      color: "#666",
    },
  },
});
