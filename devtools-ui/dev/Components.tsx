import create, { SetStore, UseStore } from "stalo";
import Panel from "../src/Panel";
import { compose } from "stalo/lib/utils";
import devtools, { description, name } from "stalo/lib/devtools";
import immer from "stalo/lib/immer";

const useCountList: UseStore<number>[] = [];
const setCountList: SetStore<number>[] = [];

createStore("left");
createStore("right");

export function App() {
  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <div style={{ width: 200, margin: 30 }}>
        <Counter id={0} text="Increase Left" />
        <Counter id={1} text="Increase Right" />
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

export function Counter({ id, text }: { id: number; text: string }) {
  return (
    <button
      onClick={() =>
        setCountList[id]((c) => c + 1, {
          [name]: "Increment",
          [description]: "Increase the count by 1",
        })
      }
    >
      {text} {useCountList[id]()}
    </button>
  );
}

function createStore(name: string) {
  const initStat = 0;

  const [useCount, baseSetCount] = create(initStat);

  const setCount = compose(baseSetCount, immer, devtools(initStat, name));

  useCountList.push(useCount);
  setCountList.push(setCount);
}
