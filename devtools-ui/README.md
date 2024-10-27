# Overview

The devtools also uses `stalo` to manage its state, itself is a good example of how to use `stalo` for complex project.

The project use immer.js for basic state mutation. For parts that require better performance, it uses immutable.js, for example,
to handle the large amount of state records, it can handle 1,000,000 records smoothly.

## Usage

Check the [example](../examples/Devtools.tsx).

## Development

Ensure you have run `npm install` and `npm run build` in the repo root directory.

To develop the devtools-ui:

```bash
npm start
```

The entry file is the `index.html`.
