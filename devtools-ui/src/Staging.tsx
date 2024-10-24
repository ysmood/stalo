import {
  commit,
  format,
  revert,
  useEditorValue,
  useGetState,
  useSetState,
} from "./store/staging";
import { selectRecord, useSelected } from "./store/history";
import { css } from "@emotion/css";
import { Button, Title } from "./Components";
import { MonacoEditor } from "./MonacoEditor";
import { LuCheck, LuUndoDot } from "react-icons/lu";
import { VscSymbolNamespace } from "react-icons/vsc";
import { useFiltered } from "./store/filter";

export default function Staging() {
  return (
    <div className={style}>
      <Toolbar />
      <MonacoEditor className="editor" />
    </div>
  );
}

function Toolbar() {
  const getState = useGetState();

  return (
    <div className="toolbar">
      <Title text="Staging" />
      <Button
        onClick={() => revert(getState)}
        icon={<LuUndoDot size={16} />}
        title="Use current page state as staging content"
      />
      <Button
        onClick={() => commit()}
        icon={<LuCheck size={16} color="#20cf20" />}
        text="Commit"
        title="Set page state as staging content"
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
  const setState = useSetState();
  const editorValue = useEditorValue();

  return (
    <div className="travel">
      <Title text="Travel" />
      <input
        type="range"
        step={1}
        min={0}
        max={filtered.length - 1}
        value={value}
        title="Time travel the state records by dragging the slider"
        onChange={async (e) => {
          const index = parseInt(e.target.value);
          selectRecord(filtered[index]);
          setState(JSON.parse(editorValue()));
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
      gap: 10,
      padding: "0 10px",

      input: {
        opacity: 0.5,
        ":hover, :focus": {
          opacity: 1,
        },
      },
    },
  },

  ".editor": {
    height: "100%",
    boxShadow: "0 0 5px #1e1e1e",
  },
});
