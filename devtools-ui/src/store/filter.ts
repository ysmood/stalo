import { setSession, useSession } from "./session";
import { debounce } from "./utils";

export function useFilter() {
  return useSession((s) => s.records.filter);
}

export function useFiltered() {
  return useSession((s) => s.records.filtered);
}

export const setFilter = debounce((filter: string) => {
  setSession((s) => {
    s.records.filter = filter;
  });
}, 300);
