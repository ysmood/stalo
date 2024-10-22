export const initFilter = "All";

export const filters = [initFilter, "Active", "Completed"] as const;

export type Filter = (typeof filters)[number];
