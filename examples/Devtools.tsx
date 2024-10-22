import create from "stalo";
import { compose } from "stalo/lib/utils";
import devtools from "stalo/lib/devtools";
import { Panel } from "@stalo/devtools-ui";

const init = 0;

const [useCount, baseSetCount] = create(init);

const setCount = compose(baseSetCount, devtools(init, "Devtools Demo"));

export default function Devtools() {
  return (
    <div>
      <h3>Basic devtools-ui usage</h3>
      <Counter />
      <h3>↑ Click the button above to create new state records ↑</h3>
      <Panel width={800} height={400} />
    </div>
  );
}

function Counter() {
  return (
    <div className="my-1">
      <button onClick={() => setCount((c) => c + 1)}>
        <h4>Increase {useCount()}</h4>
      </button>
    </div>
  );
}
