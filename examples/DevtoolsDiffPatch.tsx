import create from "stalo";
import { compose } from "stalo/lib/utils";
import devtools, { meta, immerWithPatch } from "stalo/lib/devtools";
import { Panel } from "@stalo/devtools-ui";

const initStore = { title: "Counter", count: 0 };

const [use, _set] = create(initStore);

const set = compose(_set, immerWithPatch(), devtools(initStore, "DiffPatch"));

const desc = "It only sends the diff patch to devtools not the whole state.";

function increase() {
  set((state) => {
    state.count += 1;
  }, meta("increase", desc));
}

export default function Devtools() {
  const { title, count } = use();
  return (
    <div>
      <h3>Devtools with record patch</h3>
      <button onClick={increase} className="my-1">
        <h2>
          {title} {count}
        </h2>
      </button>
      <h3>{desc}</h3>
      <Panel width={800} height={400} />
    </div>
  );
}
