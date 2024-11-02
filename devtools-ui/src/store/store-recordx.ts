// Extended StoreRecord

import { StoreRecord, encode } from "stalo/lib/devtools";
import { uid } from "stalo/lib/utils";
import { applyPatches } from "immer";

export type StoreRecordX = {
  _id: string;

  parsedCache?: unknown;
  stringCache?: string;

  rec: StoreRecord<string | undefined>;
  last?: StoreRecordX;
};

export function newStoreRecordX(
  rec: StoreRecord<string | undefined>,
  last?: StoreRecordX
): StoreRecordX {
  return {
    _id: uid(),
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
