import { it, expect } from "vitest";
import { produce, SetStore } from ".";
import { compose, deepEqual, Middleware, uid } from "./utils";

it("compose", async () => {
  let state = 0;
  const set: SetStore<number> = (ns) => {
    state = produce(state, ns);
  };

  const addOne: Middleware<number> = (set) => (ns) => {
    set((s) => {
      return produce(s, ns) + 1;
    });
  };

  const double: Middleware<number> = (set) => (ns) => {
    set((s) => {
      return produce(s, ns) * 2;
    });
  };

  compose(set, addOne, double)(2);

  expect(state).toBe(6);
});

it("deepEqual", async () => {
  expect(deepEqual({ a: 1, b: [1, 2] }, { a: 1, b: [1, 2] })).toBeTruthy();
  expect(deepEqual(null, 1)).toBeFalsy();
  expect(deepEqual([], {})).toBeFalsy();
  expect(deepEqual([1], [])).toBeFalsy();
  expect(deepEqual([1], [2])).toBeFalsy();
  expect(deepEqual({ a: 1 }, {})).toBeFalsy();
  expect(deepEqual({ a: 1 }, { a: 2 })).toBeFalsy();
});

it("uid", async () => {
  expect(uid()).toHaveLength(8);
});
