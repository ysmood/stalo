import {
  delTodo,
  toggleTodo,
  updateTodo,
  useTodo,
  useTodoDone,
} from "./store/todos";

type AttrID = { id: string };

// The component to display a todo.
export default function TodoItem({ id }: AttrID) {
  return (
    <div className="flex gap-1 my-1">
      <Done id={id} />
      <Input id={id} />

      <button onClick={() => delTodo(id)} title="Delete current todo">
        ✕
      </button>
    </div>
  );
}

function Done({ id }: AttrID) {
  return (
    <input
      type="checkbox"
      checked={useTodoDone(id)}
      onChange={() => toggleTodo(id)}
    />
  );
}

function Input({ id }: AttrID) {
  const { done, text } = useTodo(id);
  return (
    <input
      placeholder="Input text here"
      value={text}
      onChange={(e) => updateTodo(id, e.target.value)}
      disabled={done}
      autoFocus
    />
  );
}
