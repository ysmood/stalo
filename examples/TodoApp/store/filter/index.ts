import { setStore, useStore, Store } from "..";
import { Filter } from "./constants";

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

export function useFilteredIDs() {}

export function addFilteredID(s: Store, id: string) {
  s.filteredIDs.unshift(id);
}
