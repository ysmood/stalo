import { setStore, Store, useStore } from "..";
import { info } from "stalo/lib/devtools";
import { initTodo } from "./constants";

// Get a todo by id.
export function useTodo(id: string) {
  return useStore((s) => s.todos[id]);
}

export function useTodoDone(id: string) {
  return useStore((s) => s.todos[id].done);
}

// Get a new id list only when the ids of the todos change.
export function useFilteredIDs() {
  return useStore((s) => s.filteredIDs);
}

// Update the text of a todo by id.
export function updateTodo(id: string, text: string) {
  setStore((s) => {
    s.todos[id].text = text;
  }, info("update-todo"));
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

export function add(s: Store) {
  const id = Date.now().toString();
  s.todos[id] = { ...initTodo, id };

  if (s.filter !== "Completed") {
    s.filteredIDs.unshift(id);
  }
}

export function del(s: Store, id: string) {
  s.filteredIDs = s.filteredIDs.filter((i) => i !== id);
  delete s.todos[id];
}

export function toggle(s: Store, id: string, done: boolean) {
  s.todos[id].done = done;
}
