import create from "stalo";
import Panel from "../src/Panel";
import { compose } from "stalo/lib/utils";
import devtools, { description, name } from "stalo/lib/devtools";
import immer from "stalo/lib/immer";

const initStat = 0;

const [useCount, baseSetCount] = create(initStat);

const setCount = compose(baseSetCount, immer, devtools(initStat));

export function App() {
  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <div style={{ width: 200, margin: 30 }}>
        <Counter />
      </div>
      <div
        style={{
          flex: 1,
          height: "100vh",
          borderLeft: "1px solid #ccc",
          overflowY: "scroll",
        }}
      >
        <Panel />
      </div>
    </div>
  );
}

export function Counter() {
  return (
    <button
      onClick={() =>
        setCount((c) => c + 1, {
          [name]: "Increment",
          [description]: "Increase the count by 1",
        })
      }
    >
      Increase {useCount()}
    </button>
  );
}
