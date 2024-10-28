import "./index.css";
import { Link, Switch, Router, Route } from "wouter";
import { lazy, Suspense } from "react";

type Import = () => Promise<{ default: React.ComponentType<unknown> }>;

const examples: { [key: string]: Import } = {
  Counter: () => import("./Counter"),
  CounterPersistent: () => import("./CounterPersistent"),
  MonolithStore: () => import("./MonolithStore"),
  TodoApp: () => import("./TodoApp"),
  Devtools: () => import("./Devtools"),
};

export default function App() {
  return (
    <>
      <Navbar />

      <Switch>
        <ExampleRoute path="/" im={examples.Counter} />
        <Router base="/examples">
          {Object.keys(examples).map((name) => (
            <ExampleRoute key={name} path={`/${name}`} im={examples[name]} />
          ))}
        </Router>
      </Switch>
    </>
  );
}

function Navbar() {
  return (
    <>
      {Object.keys(examples).map((name) => {
        return (
          <Link href={`/examples/${name}`} key={name} className={"mx-1"}>
            {name}
          </Link>
        );
      })}
    </>
  );
}

function ExampleRoute({ path, im }: { path: string; im: Import }) {
  const Example = lazy(im);
  return (
    <Route path={path}>
      <Suspense fallback={<h2>Loading...</h2>}>
        <Example />
      </Suspense>
    </Route>
  );
}
