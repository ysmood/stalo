import {
  setStaging,
  commit,
  useStaging,
  revert,
  useSelectedSession,
} from "./store";
import { css } from "@emotion/css";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { okaidia } from "@uiw/codemirror-theme-okaidia";
import { Button, Title } from "./Components";

export default function Staging() {
  const staging = useStaging();
  const sessionID = useSelectedSession();

  return (
    <div className={style}>
      <div className="toolbar">
        <Title text="Staging" />
        <Button onClick={() => revert()} text="Revert" />
        <Button onClick={() => commit(sessionID, staging)} text="Commit" />
      </div>

      <div className="editor">
        <CodeMirror
          value={staging}
          height="100%"
          extensions={[json()]}
          theme={okaidia}
          onChange={(val) => {
            setStaging(val);
          }}
        />
      </div>
    </div>
  );
}

const style = css({
  label: "Editor",

  display: "flex",
  gap: 10,
  flexDirection: "column",
  gridArea: "staging",

  ".toolbar": {
    display: "flex",
    alignItems: "center",
    gap: 10,
    height: 40,
  },

  ".editor": {
    flex: 1,
  },
});
