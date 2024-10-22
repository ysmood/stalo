import { commit, format, revert, useGetState } from "./store";
import { css } from "@emotion/css";
import { Button, Title } from "./Components";
import { MonacoEditor } from "./MonacoEditor";
import { LuCheck, LuUndoDot } from "react-icons/lu";
import { VscSymbolNamespace } from "react-icons/vsc";

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
  },

  ".editor": {
    height: "100%",
    boxShadow: "0 0 5px #1e1e1e",
  },
});
