import "./index.css";
import { Link, Switch, Router, Route, useLocation } from "wouter";
import { lazy, ReactNode, Suspense } from "react";
import { FaGithub } from "react-icons/fa";
import { GoFileCode } from "react-icons/go";

type Import = () => Promise<{ default: React.ComponentType<unknown> }>;

const examples = {
  "Counter.tsx": () => import("./Counter"),
  "CounterPersistent.tsx": () => import("./CounterPersistent"),
  MonolithStore: () => import("./MonolithStore"),
  TodoApp: () => import("./TodoApp"),
  "Devtools.tsx": () => import("./Devtools"),
};

const firstExample = Object.keys(examples)[0];

export default function App() {
  return (
    <>
      <Navbar />

      <Switch>
        <ExampleRoute path="/" im={getExample(firstExample)} />
        <Router base="/examples">
          {Object.keys(examples).map((name) => (
            <ExampleRoute key={name} path={`/${name}`} im={getExample(name)} />
          ))}
        </Router>
      </Switch>
    </>
  );
}

function Navbar() {
  let [location] = useLocation();
  if (location === "/") location = "/examples/Counter.tsx";

  return (
    <div className="navbar flex item-center gap-2">
      <div className="logo">Stalo Examples</div>
      <Button>
        <a href="https://github.com/ysmood/stalo" target="about:blank">
          <FaGithub size={16} />
        </a>
      </Button>
      {Object.keys(examples).map((name) => {
        const href = `/examples/${name}`;
        return (
          <Link href={href} key={name}>
            <Button active={location === href}>{name}</Button>
          </Link>
        );
      })}
    </div>
  );
}

function ExampleRoute({ path, im }: { path: string; im: Import }) {
  const Example = lazy(im);

  return (
    <Route path={path}>
      <Suspense fallback={<h2>Loading...</h2>}>
        <Source path={path} />
        <Example />
      </Suspense>
    </Route>
  );
}

function Source({ path }: { path: string }) {
  const link = `https://github.com/ysmood/stalo/blob/main/examples${path}${
    path === "/" ? firstExample : ""
  }`;

  return (
    <Button title="Source code of current example">
      <a href={link} target="about:blank">
        <div className="my-1 source flex item-center gap-1">
          <GoFileCode size={16} />
          <div>Source Code</div>
        </div>
      </a>
    </Button>
  );
}

function Button({
  children: text,
  active = false,
  title,
}: {
  children: ReactNode;
  active?: boolean;
  title?: string;
}) {
  return (
    <div className={"button" + (active ? " active" : "")} title={title}>
      {text}
    </div>
  );
}

function getExample(name: string) {
  return (examples as { [key: string]: Import })[name];
}
