import { it, expect } from "vitest";
import create, { producer } from ".";
import { compose, Middleware } from "./utils";
import devtools, { description, getDevtools, name, noName } from "./devtools";
import { render } from "@testing-library/react";

it("devtools", async () => {
  const init = 1;
  const [use, set] = create(init);

  const addOne: Middleware<number> = (set) => (ns, opts) => {
    set((s) => {
      return producer(ns)(s)! + 1;
    }, opts);
  };

  expect(getDevtools()).toHaveLength(0);

  const setStore = compose(set, addOne, devtools(init));

  compose(set, addOne, devtools(init));

  const d = getDevtools<number>()[0];

  expect(d.state).toBe(1);

  let count = 0;
  const close = d.subscribe((record) => {
    count++;

    switch (count) {
      case 1:
        expect(record.state).toBe(3);
        expect(record.name).toBe("name");
        expect(record.description).toBe("desc");
        break;
      case 2:
        expect(record.state).toBe(4);
        expect(record.name).toBe(noName);
        expect(record.description).toBeUndefined();
        break;
    }
  });

  setStore(2, { [name]: "name", [description]: "desc" });
  setStore(3);

  close();

  setStore(3);

  expect(count).toBe(2);

  d.state = 100;

  function A() {
    expect(use()).toBe(100);
    return null;
  }

  render(<A />);
});
