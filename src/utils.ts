import { useRef } from "react";
import { SetStore, type Selector } from ".";

export type Equal<R> = (a: R, b: R) => boolean;

/**
 *
 * @param selector Same as the selector in useStore.
 * @param equal If equal returns true, the previous selected value will be returned,
 * else the current selected value will be returned.
 * @returns
 */
export function useEqual<S, R>(
  selector: Selector<S, R>,
  equal: Equal<R>
): Selector<S, R> {
  const prev = useRef<R>();

  return (val, serverSide) => {
    const selected = selector(val, serverSide);
    return (prev.current =
      prev.current !== undefined && equal(prev.current, selected)
        ? prev.current
        : selected);
  };
}

/**
 * A middleware to update the state with options.
 */
export type Middleware<S> = (set: SetStore<S>) => SetStore<S>;

/**
 * Composes multiple middlewares.
 */
export function compose<S>(
  setStore: SetStore<S>,
  ...middlewares: Middleware<S>[]
) {
  return middlewares.reduceRight((s, middleware) => middleware(s), setStore);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;

  if (
    a === null ||
    b === null ||
    typeof a !== "object" ||
    typeof b !== "object"
  ) {
    return false;
  }

  if (Array.isArray(a) !== Array.isArray(b)) return false;

  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false;
  }

  return true;
}

export function uid(length: number = 8): string {
  return Array.from({ length }, () =>
    Math.floor(Math.random() * 36).toString(36)
  ).join("");
}

export type Immutable<T> = () => T;

export function immutable<T>(obj: T): Immutable<T> {
  return () => obj;
}

export function isString(value: unknown): value is string {
  return typeof value === "string";
}
