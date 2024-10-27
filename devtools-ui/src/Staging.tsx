import { commit, format, useSameLast } from "./store/staging";
import { selectRecord, travelTo, useSelected } from "./store/history";
import { css } from "@emotion/css";
import { Button, Title } from "./Components";
import { MonacoEditor } from "./MonacoEditor";
import { LuCheck, LuUndoDot } from "react-icons/lu";
import { VscSymbolNamespace } from "react-icons/vsc";
import { useFiltered } from "./store/filter";
import Slider from "./Slider";

export default function Staging() {
  return (
    <div className={style}>
      <Toolbar />
      <MonacoEditor className="editor" />
    </div>
  );
}

function Toolbar() {
  return (
    <div className="toolbar">
      <Title text="Staging" />
      <Button
        onClick={() => selectRecord(-1)}
        icon={<LuUndoDot size={16} />}
        title="Revert to the last state record"
      />
      <Button
        onClick={() => commit()}
        icon={<LuCheck size={16} color="#20cf20" />}
        text="Commit"
        title="Set page state as staging content"
        disabled={useSameLast()}
      />
      <Button
        onClick={() => format()}
        icon={<VscSymbolNamespace size={14} />}
        className="format"
        title="Format json"
      />

      <Travel />
    </div>
  );
}

function Travel() {
  const filtered = useFiltered();
  const value = filtered.indexOf(useSelected());

  return (
    <div className="travel">
      <Title text="Travel" />
      <Slider
        step={1}
        min={0}
        max={filtered.size - 1}
        value={value}
        title="Time travel the state records by dragging the slider"
        onChange={async (val) => {
          const index = val;
          travelTo(filtered.get(index)!);
        }}
      />
    </div>
  );
}

const style = css({
  label: "Editor",
  gridArea: "staging",

  display: "grid",
  gap: 10,
  gridTemplateRows: "auto 1fr",

  ".toolbar": {
    display: "flex",
    alignItems: "center",
    gap: 10,

    ".format": {
      fontFamily: "monospace",
    },

    ".travel": {
      display: "grid",
      gridTemplateColumns: "auto 1fr",
      flex: 1,
      alignItems: "center",
      gap: 10,
      padding: "0 10px",

      input: {
        opacity: 0.5,
        "&:focus": {
          opacity: 0.8,
        },
        "&:hover": {
          opacity: 1,
        },
        "::-webkit-slider-thumb": {
          backgroundColor: "green",
        },
      },
    },
  },

  ".editor": {
    height: "100%",
    boxShadow: "0 0 5px #1e1e1e",
  },
});
