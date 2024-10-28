# Overview

An elegant state management solution for React.
The philosophy of this project is to keep the core simple and scalable by exposing low-level accessibility and middleware composition, not by adding options.
All the non-core functions are just examples of how you can compose functions to achieve common features.

## Features

- **Non-opinionated**: Like useState, only one core function, others are built on top of it.
- **Type safe**: The state is type safe and the return value is intuitive.
- **Global**: The state is global, you can access it anywhere.
- **Scalable**: Naturally [scale large state](https://github.com/ysmood/stalo/issues/4) into multiple modules and files without performance degradation.
- **Middlewares**: Simple and type-safe middleware composition interface.
- **Tiny**: The core is about [0.3KB](https://bundlephobia.com/package/stalo) Minified + Gzipped.
- **Devtools**: Native [devtools](https://github.com/ysmood/stalo/issues/3) support.

## Documentation

### Get started

```bash
npm install stalo
```

```tsx
import create from "stalo";

const [useCount, setCount] = create(0);

const inc = () => setCount((c) => c + 1);

export default function App() {
  return <button onClick={inc}>Count {useCount()}</button>;
}
```

### Examples

Check the [Counter](./examples/Counter.tsx) for basic usage, or try it [online](https://codesandbox.io/p/sandbox/jtfywj).

More advanced examples:

- [CounterPersistent](./examples/CounterPersistent.tsx)
- [MonolithStore](./examples/MonolithStore)
- [TodoApp](./examples/TodoApp)
- [Devtools](./examples/Devtools.tsx)

All the examples can be viewed [online](https://stalo-examples.vercel.app).

## FAQ

> Why not use [react-use's createGlobalState](https://github.com/streamich/react-use/blob/master/docs/createGlobalState.md)?

Its implementation is not type safe and the return value is not intuitive. It's too late to make a PR to change its interface.

> Why not [zustand](https://github.com/pmndrs/zustand)?

The typescript support is not good enough, the API is not intuitive. `stalo` is more like `useState` which aligns with the react API style. Check the [comparison](https://github.com/ysmood/stalo/issues/1). Zustand [Slices Pattern](https://zustand.docs.pmnd.rs/guides/slices-pattern) can cause naming conflict issues.
`stalo` can naturally scale states by modules and files.
The setter of zustand must be called within a react component, while the setter of `stalo` can be called anywhere.
