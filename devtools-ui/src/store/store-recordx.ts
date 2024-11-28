// Extended StoreRecord

import { StoreRecord, encode } from "stalo/lib/devtools";
import { applyPatches } from "immer";

export type StoreRecordX = {
  parsedCache?: unknown; // parsed state
  stringCache?: string; // json string representation of the state

  rec: StoreRecord<string | undefined>; // the state record
  last?: StoreRecordX; // the previous state record for diff calculation
};

export function newStoreRecordX(
  rec: StoreRecord<string | undefined>,
  last?: StoreRecordX
): StoreRecordX {
  return {
    rec,
    last,
  };
}

export function getState(r: StoreRecordX | undefined): string {
  if (!r) return "null";
  if (r.rec.state !== undefined) return r.rec.state;
  if (r.stringCache !== undefined) return r.stringCache;

  const last = r.last!;

  const lastState =
    last.parsedCache === undefined
      ? JSON.parse(getState(last))
      : last.parsedCache;

  r.parsedCache = applyPatches(lastState, r.rec.patch!);
  r.stringCache = encode(r.parsedCache);

  return r.stringCache;
}
