import { useTitle } from "./store";
import { increase, useCounter, useTotalCount } from "./store/counter";

// Define the app component.
export default function MonolithStore() {
  return (
    <div>
      <h3>{useTitle()}</h3>
      <Counter index={0} />
      <Counter index={1} />
      <TotalCount />
    </div>
  );
}

// Define the display component for each counter.
function Counter({ index }: { index: number }) {
  const c = useCounter(index);

  return (
    <button onClick={() => increase(index)}>
      {c.name}: {c.count}
    </button>
  );
}

function TotalCount() {
  return <h3>Total counts: {useTotalCount()}</h3>;
}