import create from "stalo";
import immer from "stalo/lib/immer";
import { Filter, initFilter, initFilteredIDs } from "./filter/constants";
import { initTodos } from "./todos/constants";
import { compose } from "stalo/lib/utils";
import logger from "./logger";
import devtools from "stalo/lib/devtools";

export const initStore = {
  todos: initTodos,
  filter: initFilter as Filter,
  filteredIDs: initFilteredIDs,
};

export type Store = typeof initStore;

const [useStore, baseSetStore] = create(initStore);

const setStore = compose(
  baseSetStore,
  immer,
  logger,
  devtools(initStore, "TodoApp")
);

export { useStore, setStore };
