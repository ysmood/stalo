import Fuse, { IFuseOptions } from "fuse.js";
import { immerable } from "immer";
import { StoreRecord } from "stalo/lib/devtools";
import { Immutable, immutable, uid } from "stalo/lib/utils";

export interface StoreRecordX extends StoreRecord<object> {
  id: string;
}

export default class History {
  [immerable] = true;

  private static fuseOptions: IFuseOptions<StoreRecordX> = {
    keys: ["id", "name", "description"],
    ignoreLocation: true,
    isCaseSensitive: true,
    threshold: 0,
    useExtendedSearch: true,
  };

  readonly list = [] as Immutable<StoreRecordX>[];

  private fuse = new Fuse<StoreRecordX>([], History.fuseOptions);
  private fuseSingle = new Fuse<StoreRecordX>([], History.fuseOptions);

  private _filter = "";
  private _filtered: number[] = [];

  private static emptyRecord: StoreRecordX = {
    id: "",
    state: {},
    name: "",
    description: "",
    createdAt: 0,
  };

  constructor(...records: StoreRecord<object>[]) {
    records.forEach((rec) => {
      this.add(rec);
    });
  }

  add(rec: StoreRecord<object>) {
    const recX = {
      ...rec,
      id: uid(),
    };

    // Use unshift will make the virtual list super slow.
    this.list.push(immutable(recX));

    // Update the fuse index.
    this.fuse.add(recX);

    // If the record matches the filter, add it to the filtered list.
    if (this._filter === "") {
      this._filtered.push(this.list.length - 1);
    } else if (this.fuseSingle.search(this._filter).length > 0) {
      this.fuseSingle.removeAt(0);
      this._filtered.push(this.list.length - 1);
    }
  }

  get(index: number) {
    const rec = this.list[index];
    if (!rec) {
      return History.emptyRecord;
    }
    return rec();
  }

  set filter(value: string) {
    this._filter = value;

    if (value === "") {
      this._filtered = this.list.map((_, i) => i);
    } else {
      this._filtered = this.fuse.search(value).map(({ refIndex }) => refIndex);
    }
  }

  get filter() {
    return this._filter;
  }

  get filtered() {
    return this._filtered;
  }
}
