import {
  commit,
  format,
  toggleDiffMode,
  useDiffMode,
  useSameLast,
} from "./store/staging";
import { selectRecord, travelTo } from "./store/history";
import { css } from "@emotion/css";
import { Button, Title } from "./Components";
import { Editor } from "./Editor";
import { LuCheck, LuUndoDot } from "react-icons/lu";
import { VscSymbolNamespace } from "react-icons/vsc";
import { useFiltered } from "./store/filter";
import Slider from "./Slider";
import AutoSizer from "react-virtualized-auto-sizer";
import { TbClockCode } from "react-icons/tb";
import { DiffEditor } from "./DiffEditor";
import { VscDiffMultiple } from "react-icons/vsc";
import * as List from "./store/list";
import React from "react";

export default function Staging() {
  return (
    <div className={style}>
      <Toolbar />
      <Editors />
    </div>
  );
}

function Editors() {
  const diffMode = useDiffMode();

  return (
    <div>
      <AutoSizer>
        {({ width, height }) =>
          diffMode ? (
            <DiffEditor width={width} height={height} />
          ) : (
            <Editor className="editor" width={width} height={height} />
          )
        }
      </AutoSizer>
    </div>
  );
}

function Toolbar() {
  const diffMode = useDiffMode();

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

      <Button
        onClick={() => toggleDiffMode()}
        icon={<VscDiffMultiple size={14} />}
        className="diff"
        title="Diff mode"
        selected={diffMode}
      />
      <Travel />
    </div>
  );
}

function Travel() {
  const filtered = useFiltered();
  const [value, setValue] = React.useState(0);

  return (
    <div
      className="travel"
      title="Time travel the state records by dragging the slider"
    >
      <TbClockCode size={20} />
      <Slider
        step={1}
        min={0}
        max={List.getSize(filtered) - 1}
        value={value}
        onChange={async (val) => {
          setValue(val);
          travelTo(List.getItem(filtered, val)!);
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

    ".diff.selected": {
      background: "#ad0c46",
      "&:hover": {
        background: " #e6427d",
      },
    },

    ".travel": {
      display: "grid",
      gridTemplateColumns: "auto 1fr",
      flex: 1,
      alignItems: "center",
      gap: 5,
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
});
