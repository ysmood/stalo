import create from "stalo";
import immer from "stalo/lib/immer";
import { Filter, initFilter } from "./filter/types";
import { initTodo } from "./todos/types";
import { compose } from "stalo/lib/utils";
import logger from "./logger";
import devtools from "stalo/lib/devtools";

export const initStore = {
  todos: [initTodo],
  filter: initFilter as Filter,
};

export type Store = typeof initStore;

const [useStore, baseSetStore] = create(initStore);

const setStore = compose(baseSetStore, immer, logger, devtools(initStore));

export { useStore, setStore };
