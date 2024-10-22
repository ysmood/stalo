import { setStore, Store, useStore } from "..";
import { numbersEqual } from "./utils";
import { Filter } from "../filter/constants";
import { useEqual } from "stalo/lib/utils";
import { name } from "stalo/lib/devtools";

// Get a todo by id.
export function useTodo(id: number) {
  return useStore((s) => findTodo(s, id));
}

export function useTodoDone(id: number) {
  return useStore((s) => findTodo(s, id).done);
}

// Get a new id list only when the ids of the todos change.
export function useTodoIds() {
  return useStore(
    useEqual((s) => {
      return filterTodos(s, s.filter).map(({ id }) => id);
    }, numbersEqual)
  );
}

export function useZeroCount() {
  return useStore((s) => {
    return filterTodos(s, s.filter).map(({ id }) => id).length === 0;
  });
}

// Get the count of the left todos.
export function useLeftCount() {
  return useStore((s) => s.todos.filter(({ done }) => !done).length);
}

export function useZeroDone() {
  return useStore((s) => !s.todos.some(({ done }) => done));
}

// Update the text of a todo by id.
export function updateTodo(id: number, text: string) {
  setStore(
    (s) => {
      findTodo(s, id).text = text;
    },
    { [name]: "update-todo" }
  );
}

// Toggle the done state of a todo by id.
export function toggleTodo(id: number) {
  setStore((s) => {
    const todo = findTodo(s, id);
    if (todo) {
      todo.done = !todo.done;
    }
  });
}

// Delete a todo by id.
export function delTodo(id: number) {
  setStore((s) => {
    s.todos = s.todos.filter((todo) => todo.id !== id);
  });
}

// Find a todo by id.
function findTodo(s: Store, id: number) {
  return s.todos.find((todo) => todo.id === id)!;
}

// Filter the todos by the current status.
export function filterTodos(s: Store, filter: Filter) {
  return s.todos.filter(({ done }) => {
    switch (filter) {
      case "All":
        return true;
      case "Active":
        return !done;
      case "Completed":
        return done;
    }
  });
}
