import { create } from "stalo/lib/immer";
import { Record } from "stalo/lib/devtools";
import { useEqual } from "stalo/lib/utils";
import deepEqual from "deep-equal";

export interface Connection {
  setState(json: string): void;
  onInit?: (data: Record<unknown>) => void;
  onRecord?: (data: Record<unknown>) => void;
}

const initStore = {
  selected: 0,
  current: null as unknown,
  staging: "",
  history: [] as Record<unknown>[],
};

let setState: Connection["setState"];

const [useStore, setStore] = create(initStore);

export function plug(c: Connection) {
  setState = c.setState;

  c.onInit = (rec) => {
    setStore((s) => {
      s.selected = 0;
      s.current = rec.state;
      s.staging = JSON.stringify(rec.state, null, 2);

      s.history.length = 0;
      s.history.push(rec);
    });
  };

  c.onRecord = (data) => {
    setStore((s) => {
      s.current = data.state;
      s.history.push(data);
    });
  };
}

export function useRecord(id: number) {
  return useStore((s) => s.history[id]);
}

// diff between a record with the selected record
export function useTimeDiff(id: number) {
  return useStore((s) => {
    return s.history[id].createdAt - s.history[s.selected].createdAt;
  });
}

export function useHistoryIDs() {
  return useStore(useEqual((s) => s.history.map((_, i) => i), deepEqual));
}

export function useStaging() {
  return useStore((s) => s.staging);
}

export function setStaging(val: string) {
  setStore((s) => {
    s.staging = val;
  });
}

export function useSelected() {
  return useStore((s) => s.selected);
}

export function selectRecord(i: number) {
  setStore((s) => {
    s.selected = i;
    s.staging = JSON.stringify(s.history[i].state, null, 2);
  });
}

export const commitName = "@@commit";

export function commit(staging: string) {
  setStore((s) => {
    s.current = JSON.parse(staging);
    s.history.push({
      state: s.current,
      name: commitName,
      description: "Committed by devtools",
      createdAt: Date.now(),
    });
  });
  setState(staging);
}

export function revert() {
  setStore((s) => {
    s.staging = JSON.stringify(s.current, null, 2);
  });
}
