import { setStore, useStore, Store } from "..";
import { onAdd, onDel } from "../todos";
import { Filter } from "./constants";

onAdd((s, id) => {
  if (s.filter !== "Completed") {
    s.filteredIDs.unshift(id);
  }
});

onDel((s, id) => {
  s.filteredIDs = s.filteredIDs.filter((i) => i !== id);
});

// Get a new id list only when the ids of the todos change.
export function useFilteredIDs() {
  return useStore((s) => s.filteredIDs);
}

export function useFilter() {
  return useStore((state) => state.filter);
}

export function setFilter(filter: string) {
  setStore((s) => {
    s.filter = filter as Filter;

    s.filteredIDs = Object.keys(s.todos).filter((id) => {
      const { done } = s.todos[id];
      switch (filter) {
        case "All":
          return true;
        case "Active":
          return !done;
        case "Completed":
          return done;
      }
    });
  });
}

export function addFilteredID(s: Store, id: string) {
  s.filteredIDs.unshift(id);
}
