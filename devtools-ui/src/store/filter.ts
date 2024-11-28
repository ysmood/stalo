import { setSession, useSession } from "./session";
import { debounce } from "./utils";
import { setFilter as recordsSetFilter } from "./records";

export function useFilter() {
  return useSession((s) => s.records.filter);
}

export function useFiltered() {
  return useSession((s) => s.records.filtered);
}

export const setFilter = debounce((filter: string) => {
  setSession((s) => {
    recordsSetFilter(s.records, filter);
  });
}, 300);
