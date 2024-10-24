import { setSession, useSession } from "./session";
import debounce from "debounce";

export function useFilter() {
  return useSession((s) => s.history.filter);
}

export function useFiltered() {
  return useSession((s) => s.history.filtered);
}

export const setFilter = debounce((filter: string) => {
  setSession((s) => {
    s.history.filter = filter;
  });
}, 300);
