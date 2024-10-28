import Fuse, { type IFuseOptions } from "fuse.js";
import { applyPatches, immerable } from "immer";
import { type StoreRecord, encode } from "stalo/lib/devtools";
import { uid } from "stalo/lib/utils";
import { List } from "immutable";

export class StoreRecordX implements StoreRecord<string> {
  readonly id = uid();

  private parsedCache: unknown | undefined;
  private stringCache: string | undefined;

  constructor(
    private rec: StoreRecord<string | undefined>,
    private last?: StoreRecordX
  ) {}

  get state(): string {
    if (this.rec.state !== undefined) return this.rec.state;
    if (this.stringCache !== undefined) return this.stringCache;

    const last = this.last!;

    const lastState =
      last.parsedCache === undefined
        ? JSON.parse(last.state)
        : last.parsedCache;

    this.parsedCache = applyPatches(lastState, this.rec.patch!);
    this.stringCache = encode(this.parsedCache);

    return this.stringCache;
  }

  get name() {
    return this.rec.name;
  }

  get description() {
    return this.rec.description;
  }

  get createdAt() {
    return this.rec.createdAt;
  }
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

  private _list = List<StoreRecordX>();

  private fuse = new Fuse<StoreRecordX>([], History.fuseOptions);
  private fuseSingle = new Fuse<StoreRecordX>([], History.fuseOptions);

  private _filter = "";
  private _filtered = List<number>();

  private static emptyRecord = new StoreRecordX({
    state: "null",
    name: "",
    description: "",
    createdAt: 0,
  });

  constructor(...records: StoreRecord<string>[]) {
    records.forEach((rec) => {
      this.add(rec);
    });
  }

  add(rec: StoreRecord<string | undefined>) {
    const recX = new StoreRecordX(rec, this._list.last());

    // Use unshift will make the virtual list super slow.
    this._list = this._list.push(recX);

    // Update the fuse index.
    this.fuse.add(recX);

    // If the record matches the filter, add it to the filtered list.
    if (this._filter === "") {
      this._filtered = this._filtered.push(this._list.size - 1);
    } else if (this.fuseSingle.search(this._filter).length > 0) {
      this.fuseSingle.removeAt(0);
      this._filtered = this._filtered.push(this._list.size - 1);
    }
  }

  get(index: number) {
    const rec = this._list.get(index);
    if (!rec) {
      return History.emptyRecord;
    }
    return rec;
  }

  set filter(value: string) {
    this._filter = value;

    if (value === "") {
      this._filtered = this._list.map((_, i) => i);
    } else {
      this._filtered = List(
        this.fuse.search(value).map(({ refIndex }) => refIndex)
      );
    }
  }

  get list() {
    return this._list;
  }

  get size() {
    return this._list.size;
  }

  get filter() {
    return this._filter;
  }

  get filtered() {
    return this._filtered;
  }
}
