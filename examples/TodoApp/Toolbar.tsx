import Filter from "./Filter";
import { addTodo, clearCompleted } from "./store/toolbar";
import ToggleAll from "./ToggleAll";
import { useTotalCount } from "../MonolithStore/store/counter";

export default function Toolbar() {
  return (
    <div className="flex gap-1">
      <ToggleAll />
      <Filter />
      <AddTodo />
      <ClearCompleted />
    </div>
  );
}

function AddTodo() {
  return (
    <button onClick={addTodo} title="Add new todo">
      +
    </button>
  );
}

function ClearCompleted() {
  return (
    <button
      onClick={clearCompleted}
      disabled={useTotalCount() === 0}
      title="Delete all completed todos"
    >
      ✂️
    </button>
  );
}
