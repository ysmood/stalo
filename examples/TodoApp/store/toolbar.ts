import { setStore, useStore } from ".";
import { initTodo } from "./todos/types";
import { filterTodos } from "./todos";

// Add a new empty todo to the list.
export function addTodo() {
  setStore((s) => {
    s.todos.unshift({ ...initTodo, id: Date.now() });
  });
}

// Clear all completed todos.
export function clearCompleted() {
  setStore((s) => {
    s.todos = s.todos.filter(({ done }) => !done);
  });
}

// Get the toggleAll state.
export function useToggleAll() {
  return useStore((s) => {
    const todos = filterTodos(s, s.filter);
    if (todos.length === 0) {
      return false;
    }
    return todos.every(({ done }) => done);
  });
}

// Toggle all the current filtered todos.
export function toggleAll() {
  setStore((s) => {
    const todos = filterTodos(s, s.filter);
    if (todos.every(({ done }) => done)) {
      todos.forEach((todo) => {
        todo.done = false;
      });
    } else {
      todos.forEach((todo) => {
        todo.done = true;
      });
    }
  });
}
