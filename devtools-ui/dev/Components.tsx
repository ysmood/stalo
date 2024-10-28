import create, { SetStore, UseStore } from "stalo";
import Panel from "../src/Panel";
import { compose } from "stalo/lib/utils";
import devtools, { immerWithPatch, meta } from "stalo/lib/devtools";
import immer from "stalo/lib/immer";

type Store = {
  val: number;
};

const useList: UseStore<Store>[] = [];
const setList: SetStore<Store>[] = [];

createStore("x", 1);
createStore("y", 2);
createStore("z", 3, true);

export function App() {
  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <div style={{ width: 200, margin: 30 }}>
        <Counter id={0} text="X" />
        <Counter id={1} text="Y" />
        <Counter id={2} text="Z" />
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
    <div>
      <h3>{text}</h3>
      <Button id={id} n={1} />
      <Button id={id} n={1000} />
      <Button id={id} n={100000} />
      <div>count: {useList[id]((s) => s.val)}</div>
    </div>
  );
}

function createStore(name: string, val: number, patch = false) {
  const init = { val: val };
  const [use, baseSet] = create(init);

  const immerM = patch ? immerWithPatch<Store>() : immer;

  const set = compose(baseSet, immerM, devtools(init, name));

  useList.push(use);
  setList.push(set);
}

function Button({ id, n }: { id: number; n: number }) {
  return (
    <button
      onClick={() => {
        for (let i = 0; i < n; i++) {
          setList[id]((s) => {
            s.val++;
          }, meta("Increment", `Increase the count by ${n}`));
        }
      }}
    >
      Add {n}
    </button>
  );
}
