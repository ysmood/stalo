import { it, expect, describe, afterEach } from "vitest";
import create, { produce } from ".";
import { compose, Middleware } from "./utils";
import devtools, {
  encode,
  getDevtools,
  immerWithPatch,
  meta,
  StoreRecord,
} from "./devtools";
import { render } from "@testing-library/react";

describe("devtools", () => {
  afterEach(() => {
    getDevtools().forEach((d) => {
      d.close();
    });
  });

  it("basic", async () => {
    const init = 1;
    const [use, set] = create(init);

    const addOne: Middleware<number> = (set) => (ns, ctx) => {
      set((s) => {
        return produce(s, ns) + 1;
      }, ctx);
    };

    expect(getDevtools()).toHaveLength(0);

    const setStore = compose(set, addOne, devtools(init));

    compose(set, addOne, devtools(init));

    const d = Array.from(getDevtools<number>())[0];

    expect(d.state).toBe(1);

    let count = 0;
    const close = d.subscribe((record) => {
      count++;

      switch (count) {
        case 1:
          expect(record.state).toBe(3);
          expect(record.name).toBe("foo");
          expect(record.description).toBe("desc");
          break;
        case 2:
          expect(record.state).toBe(4);
          expect(record.name).toBe("");
          expect(record.description).toBeUndefined();
          break;
      }
    });

    function foo() {}

    setStore(2, meta(foo, "desc"));
    setStore(3);

    close();

    setStore(3, meta("foo", "desc"));

    expect(count).toBe(2);

    d.state = 100;

    function A() {
      expect(use()).toBe(100);
      return null;
    }

    render(<A />);
  });

  it("patch", async () => {
    const init = 1;
    const [use, set] = create(init);

    const setStore = compose(set, immerWithPatch(), devtools(init));

    const records: StoreRecord<number>[] = [];
    const d = Array.from(getDevtools<number>())[0];

    d.subscribe((record) => {
      records.push(record);
    });

    setStore(10);

    function A() {
      expect(use()).toBe(10);
      return null;
    }

    render(<A />);

    expect(records[0].patch).toEqual([
      {
        op: "replace",
        path: [],
        value: 10,
      },
    ]);
  });

  it("patch with meta", async () => {
    const init = 1;
    const [use, set] = create(init);

    const setStore = compose(set, immerWithPatch(), devtools(init));

    const records: StoreRecord<number>[] = [];
    const d = Array.from(getDevtools<number>())[0];

    d.subscribe((record) => {
      records.push(record);
    });

    setStore(10, meta("foo"));

    function A() {
      expect(use()).toBe(10);
      return null;
    }

    render(<A />);

    expect(records[0].patch).toEqual([
      {
        op: "replace",
        path: [],
        value: 10,
      },
    ]);
  });

  it("encode", async () => {
    expect(encode({ a: 1 })).toEqual('{\n  "a": 1\n}');
  });
});
