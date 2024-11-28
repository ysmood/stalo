import Fuse, { type IFuseOptions } from "fuse.js";
import { newStoreRecordX, StoreRecordX } from "./store-recordx";
import { StoreRecord } from "stalo/lib/devtools";
import {
  addItem,
  getItem,
  getLast,
  getSize,
  List,
  mapItems,
  newList,
} from "./list";

const fuseOptions: IFuseOptions<StoreRecordX["rec"]> = {
  keys: ["name", "description"],
  ignoreLocation: true,
  isCaseSensitive: true,
  threshold: 0,
  useExtendedSearch: true,
};

const emptyRecord = newStoreRecordX({
  state: "null",
  name: "",
  description: "",
  createdAt: 0,
});

type Records = {
  list: List<StoreRecordX>;
  filter: string;
  filtered: List<number>;

  _fuse: Fuse<StoreRecordX["rec"]>;
  _fuseSingle: Fuse<StoreRecordX["rec"]>;
};

export function newRecords(...records: StoreRecord<string>[]): Records {
  const r: Records = {
    list: newList<StoreRecordX>(),
    filter: "",
    filtered: newList<number>(),

    _fuse: new Fuse<StoreRecordX["rec"]>([], fuseOptions),
    _fuseSingle: new Fuse<StoreRecordX["rec"]>([], fuseOptions),
  };

  records.forEach((rec) => {
    addRecord(r, rec);
  });

  return r;
}

export function addRecord(r: Records, rec: StoreRecord<string | undefined>) {
  const recX = newStoreRecordX(rec, getLast(r.list));

  // Use unshift will make the virtual list super slow.
  r.list = addItem(r.list, recX);

  // Update the fuse index.
  r._fuse.add(recX.rec);

  // If the record matches the filter, add it to the filtered list.
  if (r.filter === "") {
    r.filtered = addItem(r.filtered, getSize(r.list) - 1);
  } else if (r._fuseSingle.search(r.filter).length > 0) {
    r._fuseSingle.removeAt(0);
    r.filtered = addItem(r.filtered, getSize(r.list) - 1);
  }
}

export function getRecord(r: Records, index: number) {
  const rec = getItem(r.list, index);
  if (!rec) {
    return emptyRecord;
  }
  return rec;
}

export function setFilter(r: Records, value: string) {
  r.filter = value;

  if (value === "") {
    r.filtered = mapItems(r.list, (_, i) => i);
  } else {
    r.filtered = newList(
      ...r._fuse.search(value).map(({ refIndex }) => refIndex)
    );
  }
}
