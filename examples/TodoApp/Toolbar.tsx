import Filter from "./Filter";
import { addTodo, clearCompleted } from "./store/toolbar";
import { useZeroDone } from "./store/todos";
import ToggleAll from "./ToggleAll";

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
      disabled={useZeroDone()}
      title="Delete all completed todos"
    >
      ✂️
    </button>
  );
}
