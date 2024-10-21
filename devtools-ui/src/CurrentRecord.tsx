import { css } from "@emotion/css";
import { Name, Time } from "./Components";
import { useRecord, useSelected } from "./store";

export function CurrentRecord() {
  const id = useSelected();
  const record = useRecord(id);

  if (!record) {
    return null;
  }

  return (
    <div className={style}>
      <div className="info">
        <div>
          ID: <div className="id">{id}</div>
        </div>
        <div>
          Name: <Name name={record.name} />
        </div>
        <div>
          Description:
          <div className="desc"> {record.description}</div>
        </div>
        <div>
          Created At: <Time time={record.createdAt} />
        </div>
      </div>
    </div>
  );
}

const style = css({
  label: "record-details",
  gridArea: "record-details",
  paddingTop: 10,

  ".info": {
    display: "flex",
    gap: 10,

    "> div": {
      display: "flex",
      gap: 5,
      color: "#aaa",
    },

    ".id": {
      color: "#eee",
    },

    ".desc": {
      color: "#ddd",
    },
  },
});
