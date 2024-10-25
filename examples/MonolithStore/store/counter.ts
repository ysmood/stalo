import { setStore, useStore } from ".";

// Define a getter to access a specific counter.
export function useCounter(index: number) {
  return useStore((s) => s.counters[index]);
}

// Define a setter to increase the count of a specific counter.
export function increase(index: number) {
  setStore((s) => {
    s.counters[index].count += 1;
  });
}

// Define a getter to calculate the total count of all counters.
export function useTotalCount() {
  return useStore((s) => s.counters).reduce((acc, c) => acc + c.count, 0);
}
