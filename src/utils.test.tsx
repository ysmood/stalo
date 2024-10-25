import { it, expect } from "vitest";
import { userEvent } from "@vitest/browser/context";
import { render, screen } from "@testing-library/react";
import create, { produce, SetStore } from ".";
import {
  compose,
  deepEqual,
  immutable,
  Middleware,
  uid,
  useEqual,
} from "./utils";

it("selector with equal", async () => {
  const [useVal, setVal] = create({ val: "test" });

  let count = 0;

  function A() {
    count++;
    const [{ val }] = useVal(
      useEqual(
        (s) => [s],
        ([a], [b]) => a.val === b.val
      )
    );
    return <button onClick={() => setVal({ val: "test" })}>{val}</button>;
  }

  render(<A />);

  await userEvent.click(screen.getByText("test"));

  expect(count).toBe(1);
});

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

it("immutable", async () => {
  const a = 1;
  expect(immutable(a)()).toEqual(1);
});
