import { setCurrSession, useCurrSession } from "./session";
import { debounce } from "./utils";
import { setFilter as recordsSetFilter } from "./records";

export function useFilter() {
  return useCurrSession((s) => s.records.filter);
}

export function useFiltered() {
  return useCurrSession((s) => s.records.filtered);
}

export const setFilter = debounce((filter: string) => {
  setCurrSession((s) => {
    recordsSetFilter(s.records, filter);
  });
}, 300);
