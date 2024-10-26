import { toggleAll, useAllToggled } from "./store/toolbar";
import { useFilteredIDs } from "./store/filter";

// The component to toggle all todos.
export default function ToggleAll() {
  return (
    <input
      type="checkbox"
      checked={useAllToggled()}
      onChange={toggleAll}
      disabled={useFilteredIDs().length === 0}
    />
  );
}
