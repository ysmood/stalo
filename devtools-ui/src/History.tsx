import { css, cx } from "@emotion/css";
import {
  useCurrSession,
  useSessions,
  selectSession,
  setSession,
} from "./store/session";
import {
  selectRecord,
  setScrollTo,
  useRecord,
  useScrollTo,
  useSelected,
  useTimeDiff,
} from "./store/history";
import { setFilter, useFiltered } from "./store/filter";
import { Button, Name, Title } from "./Components";
import { List, AutoSizer } from "react-virtualized";
import { recordHeight } from "./store/constants";
import { LuArrowUpToLine, LuArrowDownToLine } from "react-icons/lu";
import { useState } from "react";
import { LuDatabase } from "react-icons/lu";
import { IoDocumentTextOutline } from "react-icons/io5";

export default function History() {
  return (
    <div className={style}>
      <div className="header">
        <Header />
      </div>
      <div className="records">
        <ItemList />
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}

function Header() {
  return (
    <>
      <Title className="title" text="History" />
      <Sessions />
      <div className="session-id">
        <LuDatabase /> <code>{useCurrSession()}</code>
      </div>
    </>
  );
}

function Footer() {
  return (
    <>
      <Filter />
      <div className="total">
        <IoDocumentTextOutline size={12} />
        <span>{useFiltered().size}</span>
      </div>
      <Button
        onClick={() => {
          setSession((s) => setScrollTo(s, 0));
        }}
        icon={<LuArrowUpToLine />}
        title="Scroll to top record"
      />
      <Button
        onClick={() => {
          setSession((s) => setScrollTo(s, s.history.size - 1));
        }}
        icon={<LuArrowDownToLine />}
        title="Scroll to bottom record"
      />
    </>
  );
}

function Filter() {
  const [val, setVal] = useState("");

  return (
    <div className="filter">
      <input
        placeholder="Filter records"
        onChange={({ target: { value } }) => {
          setVal(value);
          setFilter(value);
        }}
        value={val}
      />
    </div>
  );
}

function Sessions() {
  const ss = useSessions();
  const list = Object.keys(ss).map((id) => ss[id]);

  return (
    <div className="sessions">
      <select
        onChange={(e) => selectSession(e.target.value)}
        value={useCurrSession()}
        title="Select a devtools session"
      >
        {list.map(({ id, name }) => (
          <option key={id} value={id}>
            {name || id}
          </option>
        ))}
      </select>
    </div>
  );
}

function ItemList() {
  const filtered = useFiltered();
  const scrollTo = useScrollTo();

  return (
    <AutoSizer>
      {({ height, width }) => (
        <List
          width={width}
          height={height}
          rowCount={filtered.size}
          rowHeight={recordHeight}
          scrollToIndex={scrollTo}
          rowRenderer={({ key, index: i, style }) => {
            return <Item key={key} index={filtered.get(i)!} style={style} />;
          }}
        />
      )}
    </AutoSizer>
  );
}

function Item({ index, style }: { index: number; style: React.CSSProperties }) {
  const rec = useRecord(index);

  return (
    <div
      className={cx("item", {
        selected: useSelected() === index,
      })}
      onClick={() => selectRecord(index)}
      style={style}
    >
      <div className="line title">
        <Name className="name" name={rec.name} />
        <TimeDiff duration={useTimeDiff(index)} />
        <code className="index">{index.toString().padStart(4, " ")}</code>
      </div>
      <div className="line light">
        {rec.description === undefined ? NoDescription() : rec.description}
      </div>
    </div>
  );
}

function TimeDiff({ duration }: { duration: number }) {
  if (duration === 0) return null;

  const minus = duration < 0;

  duration = Math.abs(duration);

  const sec = duration / 1000;
  const min = Math.floor(sec / 60);
  const hrs = Math.floor(min / 60);

  return (
    <div className="time-diff">
      {minus ? (
        <span className="minus">-</span>
      ) : (
        <span className="plus">+</span>
      )}
      {hrs > 0 ? <span>{hrs}h</span> : null}
      {min > 0 ? <span className="min">{min % 60}m</span> : null}
      {sec % 60 > 1 ? (
        <span>{(sec % 60).toFixed(2)}s</span>
      ) : (
        <span>{duration}ms</span>
      )}
    </div>
  );
}

function NoDescription() {
  return <span className="no-desc">No description</span>;
}

const style = css({
  label: "History",
  overflowY: "scroll",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
  gridArea: "history",

  display: "grid",
  gridTemplateRows: "auto 1fr auto",

  ".header": {
    display: "flex",
    alignItems: "center",
    gap: 10,
    boxShadow: "0 0 5px rgba(0, 0, 0, 0.5)",

    select: {
      background: "#4e4e4ec2",
      color: "white",
      padding: "0 5px",
      borderRadius: 3,
      width: "10em",
    },

    ".session-id": {
      fontSize: 10,
      color: "#777",
      display: "flex",
      alignItems: "center",
      gap: 3,
    },
  },

  ".footer": {
    display: "flex",

    ".filter": {
      display: "grid",
      width: "12em",

      input: {
        all: "unset",
        background: "#4e4e4ec2",
        color: "white",
        boxShadow: "0 0 3px rgba(0, 0, 0, 0.5) inset",
        padding: "0 10px",
      },
    },

    ".total": {
      flex: 1,
      gap: 3,
      display: "flex",
      alignItems: "center",
      paddingLeft: 10,
      fontSize: 10,
    },

    boxShadow: "0 0 5px rgba(0, 0, 0, 0.5)",
  },

  ".records": {
    overflowY: "scroll",
  },

  ".title": {
    padding: 10,
  },

  ".item": {
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: 5,
    boxSizing: "border-box",
    paddingTop: 5,
    borderBottom: "1px solid #3c3c3c",

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

      ".time-diff": {
        fontSize: 10,
        fontFamily: "monospace",

        ".minus": {
          color: "#d84685",
        },
        ".plus": {
          color: "#66ffac",
        },
      },

      ".index": {
        color: "#777",
        fontSize: 10,
        whiteSpace: "pre",
      },

      ".min": {
        color: "#e1e05a",
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
