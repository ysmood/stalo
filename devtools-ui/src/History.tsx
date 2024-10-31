import { css, cx } from "@emotion/css";
import { useCurrSession, useSessions, selectSession } from "./store/session";
import {
  scrollToBottom,
  scrollToTop,
  selectRecord,
  useRecord,
  useScrollTo,
  useSelected,
  useTimeDiff,
} from "./store/history";
import { setFilter, useFiltered } from "./store/filter";
import { Button, Name, TimeDiff, Title } from "./Components";
import { FixedSizeList } from "react-window";
import { recordHeight } from "./store/constants";
import { LuArrowUpToLine, LuArrowDownToLine } from "react-icons/lu";
import { useEffect, useRef, useState } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { LuDatabase } from "react-icons/lu";
import { IoDocumentTextOutline } from "react-icons/io5";
import { useThrottle } from "./store/utils";

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
        onClick={scrollToTop}
        icon={<LuArrowUpToLine />}
        title="Scroll to top record"
      />
      <Button
        onClick={scrollToBottom}
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
  const ref = useRef<FixedSizeList>(null);
  const scrollTo = useScrollTo();

  const scroll = useThrottle(
    (to: typeof scrollTo) => {
      ref.current?.scrollToItem(to.val, "smart");
    },
    100,
    []
  );

  useEffect(() => {
    scroll(scrollTo);
  }, [scroll, scrollTo]);

  return (
    <AutoSizer>
      {({ height, width }) => (
        <FixedSizeList
          ref={ref}
          width={width}
          height={height}
          itemCount={filtered.size}
          itemSize={recordHeight}
        >
          {({ index: i, style }) => {
            return <Item index={filtered.get(i)!} style={style} />;
          }}
        </FixedSizeList>
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
        {rec.description === undefined ? (
          <span className="no-desc">No description</span>
        ) : (
          rec.description
        )}
      </div>
    </div>
  );
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

      ".index": {
        color: "#777",
        fontSize: 10,
        whiteSpace: "pre",
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
