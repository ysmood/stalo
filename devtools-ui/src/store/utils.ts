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

export function fuzzyMatch(input: string, pattern: string): boolean {
  let patternIndex = 0;

  for (let i = 0; i < input.length; i++) {
    if (input[i] === pattern[patternIndex]) {
      patternIndex++;
    }
    if (patternIndex === pattern.length) {
      return true;
    }
  }

  return false;
}
