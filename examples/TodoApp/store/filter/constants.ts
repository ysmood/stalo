import { initTodo } from "../todos/constants";

export const initFilter = "All";

export const filters = [initFilter, "Active", "Completed"] as const;

export type Filter = (typeof filters)[number];

export const initFilteredIDs = [initTodo.id];
