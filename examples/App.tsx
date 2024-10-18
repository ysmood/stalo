import "./index.css";
import { Link, Switch, Router, Route } from "wouter";
import { lazy, Suspense } from "react";

const examples = ["Counter", "CounterPersistent", "MonolithStore", "TodoApp"];

export default function App() {
  return (
    <>
      <Navbar />

      <Switch>
        <ExampleRoute path="/" name={examples[0]} />
        <Router base="/examples">
          {examples.map((n) => (
            <ExampleRoute key={n} name={n} />
          ))}
        </Router>
      </Switch>
    </>
  );
}

function Navbar() {
  return (
    <>
      {examples.map((name) => {
        return (
          <Link href={`/examples/${name}`} key={name} className={"mx-1"}>
            {name}
          </Link>
        );
      })}
    </>
  );
}

function ExampleRoute({ name, path }: { name: string; path?: string }) {
  path = path || `/${name}`;
  const Example = lazy(() => import(/* @vite-ignore */ `./${name}`));
  return (
    <Route path={path}>
      <Suspense fallback={<div>Loading...</div>}>
        <Example />
      </Suspense>
    </Route>
  );
}
