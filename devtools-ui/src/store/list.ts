const proto = {};

function immutable<T>(l: List<T>): List<T> {
  Object.setPrototypeOf(l, proto);
  return l;
}

/**
 * Append-only immutable list.
 */
export type List<T> = {
  _list: T[];
  _size: number;
};

export function newList<T>(...arr: T[]): List<T> {
  return immutable({
    _list: arr,
    _size: arr.length,
  });
}

export function addItem<T>(l: List<T>, item: T): List<T> {
  l._list.push(item);

  return immutable({
    _list: l._list,
    _size: l._list.length,
  });
}

export function getItem<T>(l: List<T>, i: number): T | undefined {
  if (i >= l._size) return undefined;
  return l._list[i];
}

export function getLast<T>(l: List<T>): T | undefined {
  return getItem(l, l._size - 1);
}

export function getSize<T>(l: List<T>): number {
  return l._size;
}

export function mapItems<T, U>(
  l: List<T>,
  cb: (value: T, index: number) => U
): List<U> {
  const out = newList<U>();

  for (let i = 0; i < l._size; i++) {
    addItem(out, cb(l._list[i], i));
  }

  return out;
}
