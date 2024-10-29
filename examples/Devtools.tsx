import create from "stalo";
import { compose } from "stalo/lib/utils";
import devtools, { meta } from "stalo/lib/devtools";
import { Panel } from "@stalo/devtools-ui";

// Only serializable store values can be displayed in the devtools.
// Only deserializable store values can be modified by the devtools.
const initStore = 0;

const [useCount, _set] = create(initStore);

// Install the devtools middleware as the last middleware.
// You can leave it out in production, no overhead.
const setCount = compose(_set, devtools(initStore, "Demo"));

function increase(n: number) {
  setCount((c) => c + n, meta("increase", `Increase the count by ${n}`));
}

// Here we create 2 count buttons to increase the store value.
// The devtools will catch the changes and display them in the panel.
export default function Devtools() {
  return (
    <div>
      <h3>Basic devtools-ui usage</h3>
      <h2>Count {useCount()}</h2>
      <Count n={1} />
      <Count n={10} />
      <h3>
        ↑ Click the buttons above to create new state records in the devtools ↑
      </h3>
      <Panel width={800} height={400} />
    </div>
  );
}

function Count({ n }: { n: number }) {
  return (
    <button onClick={() => increase(n)}>
      <h4>Increase by {n}</h4>
    </button>
  );
}
