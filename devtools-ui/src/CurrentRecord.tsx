import { css, cx } from "@emotion/css";
import { Name, Time } from "./Components";
import { useRecord, useSelected } from "./store/history";
import { LuClock } from "react-icons/lu";
import { TfiCommentAlt } from "react-icons/tfi";
import { VscSymbolNumeric } from "react-icons/vsc";
import { CiAt } from "react-icons/ci";

export function CurrentRecord() {
  const id = useSelected();
  const record = useRecord(id);

  if (!record) {
    return null;
  }

  return (
    <div className={cx(style, "info")}>
      <div className="first-row">
        <div title="ID of the record">
          <VscSymbolNumeric /> <code className="id">{record.id}</code>
        </div>
        <div>
          <CiAt size={14} /> <Name name={record.name} />
        </div>
        <div>
          <LuClock /> <Time time={record.createdAt} />
        </div>
      </div>
      <div>
        <TfiCommentAlt />
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
  },

  ".id": {
    color: "#eee",
  },

  ".desc": {
    color: "#ddd",
    marginLeft: 4,
    lineHeight: "1.5em",
    height: "3em",
    overflow: "scroll",

    span: {
      color: "#666",
    },
  },
});
