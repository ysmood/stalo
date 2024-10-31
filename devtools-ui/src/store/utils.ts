import { DependencyList, useMemo } from "react";

type Callback<T> = (buffer: T[]) => void;

export function bufferedCall<T>(delay: number, callback: Callback<T>) {
  const buf: T[] = [];
  let lastCallTime = 0;
  let timeoutId: NodeJS.Timeout | null = null;

  return function (rec: T) {
    const now = Date.now();
    buf.push(rec);

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (now - lastCallTime < delay) {
      timeoutId = setTimeout(() => {
        callback(buf);
        buf.length = 0;
      }, delay);
    } else {
      callback(buf);
      buf.length = 0;
    }

    lastCallTime = now;
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunc = (...args: any[]) => unknown;

export function debounce<T extends AnyFunc>(callback: T, delay: number) {
  let timeoutId: NodeJS.Timeout | null = null;

  return ((...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => callback(...args), delay);
  }) as T;
}

function throttle<T extends AnyFunc>(callback: T, delay: number): T {
  let lastCallTime = 0;
  let timeoutId: NodeJS.Timeout | null = null;
  let lastArgs: Parameters<T> | null = null;

  return ((...args: Parameters<T>) => {
    const now = Date.now();

    if (lastCallTime === 0) {
      callback(...args);
      lastCallTime = now;
    } else {
      lastArgs = args;
    }

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      if (lastArgs) {
        callback(...lastArgs);
        lastArgs = null;
        lastCallTime = Date.now();
      }
    }, delay);

    if (now - lastCallTime >= delay) {
      callback(...args);
      lastCallTime = now;
    }
  }) as T;
}

export function useThrottle<T extends AnyFunc>(
  callback: T,
  delay: number,
  deps: DependencyList
): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => throttle(callback, delay), [delay, ...deps]);
}
