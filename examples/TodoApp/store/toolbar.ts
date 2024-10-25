import { setStore, Store, useStore } from ".";
import { add, del, toggle } from "./todos";

// Add a new empty todo to the list.
export function addTodo() {
  setStore((s) => {
    add(s);
  });
}

// Clear all completed todos.
export function clearCompleted() {
  setStore((s) => {
    Object.keys(s.todos).forEach((id) => {
      if (s.todos[id].done) {
        del(s, id);
      }
    });
  });
}

// Get the toggleAll state.
export function useAllToggled() {
  return useStore(allToggled);
}

// Toggle all the current filtered todos.
export function toggleAll() {
  setStore((s) => {
    const to = !allToggled(s);
    for (const k of s.filteredIDs) {
      toggle(s, k, to);
    }
  });
}

function allToggled(s: Store) {
  return s.filteredIDs.every((id) => s.todos[id].done);
}
