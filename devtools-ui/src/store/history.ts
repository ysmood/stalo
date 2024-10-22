import { immerable } from "immer";
import { Record } from "stalo/lib/devtools";
import { Immutable, immutable } from "stalo/lib/utils";

export default class History {
  [immerable] = true;

  private map = new Map<string, Immutable<Record<object>>>();
  readonly ids = [] as string[];

  private static emptyRecord: Record<object> = {
    id: "",
    state: {},
    name: "",
    description: "",
    createdAt: 0,
  };

  constructor(...records: Record<object>[]) {
    records.forEach((rec) => {
      this.add(rec);
    });
  }

  add(rec: Record<object>) {
    this.map.set(rec.id, immutable(rec));

    // Use unshift will make the virtual list super slow.
    this.ids.push(rec.id);
  }

  get(id: string) {
    const rec = this.map.get(id);
    if (!rec) {
      return History.emptyRecord;
    }
    return rec();
  }
}
