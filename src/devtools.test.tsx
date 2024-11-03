import { it, expect, describe, afterEach, vi } from "vitest";
import create, { produce } from ".";
import { compose, Middleware } from "./utils";
import devtools, {
  DEVTOOLS,
  Devtools,
  encode,
  immerWithPatch,
  meta,
  onDevtools,
  StoreRecord,
} from "./devtools";
import { render } from "@testing-library/react";

describe("devtools", () => {
  vi.useFakeTimers();

  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any)[DEVTOOLS] = undefined;
  });

  it("basic", async ({ onTestFinished }) => {
    const init = 1;
    const [use, set] = create(init);

    const addOne: Middleware<number> = (set) => (ns, ctx) => {
      set((s) => {
        return produce(s, ns) + 1;
      }, ctx);
    };

    const setStore = compose(set, addOne, devtools(init));

    compose(set, addOne, devtools(init));

    const d = await getDevtools<number>();
    onTestFinished(() => d.close());

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
    const d = await getDevtools<number>();

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
    const d = await getDevtools<number>();

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

  it("can't get devtools", async () => {
    let count = 0;
    const close = onDevtools(() => {
      count++;
    });

    Array.from({ length: 11 }).forEach(() => {
      vi.advanceTimersToNextTimer();
    });

    expect(count).toBe(0);

    close();
  });

  it("has devtools", async () => {
    let count = 0;
    const close = onDevtools(() => {
      count++;
    });

    expect(count).toBe(0);

    devtools(1)(() => 0);

    vi.advanceTimersToNextTimer();
    vi.advanceTimersToNextTimer();

    expect(count).toBe(1);

    close();
  });
});

function getDevtools<S>() {
  return new Promise<Devtools<S>>((resolve) => {
    onDevtools<S>((d) => {
      resolve(d);
    });
  });
}
