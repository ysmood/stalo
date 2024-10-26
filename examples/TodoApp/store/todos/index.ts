import { setStore, Store, useStore } from "..";
import { meta } from "stalo/lib/devtools";
import { initTodo } from "./constants";
import { pipeline } from "stalo";

// Get a todo by id.
export function useTodo(id: string) {
  return useStore((s) => s.todos[id]);
}

export function useTodoDone(id: string) {
  return useStore((s) => s.todos[id].done);
}

// Update the text of a todo by id.
export function updateTodo(id: string, text: string) {
  setStore((s) => {
    s.todos[id].text = text;
  }, meta("update-todo"));
}

export function useLeft() {
  return useStore(
    (s) => Object.keys(s.todos).filter((id) => !s.todos[id].done).length
  );
}

// Toggle the done state of a todo by id.
export function toggleTodo(id: string) {
  setStore((s) => {
    toggle(s, id, !s.todos[id].done);
  });
}

// Delete a todo by id.
export function delTodo(id: string) {
  setStore((s) => {
    del(s, id);
  });
}

// Libs like redux, immer.js or signal.js does not support reacting to item add or delete events.
// In this way we can filter the reactions to only the add event, not the item content change.
// Only use this design pattern for expensive reactions, like maintaining a large index list.
const [onAdd, pipelineAdd] = pipeline<[Store, string]>();

export { onAdd };

export function add(s: Store) {
  const id = Date.now().toString();
  s.todos[id] = { ...initTodo, id };

  pipelineAdd(s, id);
}

const [onDel, onDelPipeline] = pipeline<[Store, string]>();

export { onDel };

export function del(s: Store, id: string) {
  delete s.todos[id];

  onDelPipeline(s, id);
}

export function toggle(s: Store, id: string, done: boolean) {
  s.todos[id].done = done;
}
