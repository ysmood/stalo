import { useLeft } from "./store/todos";

export default function Title() {
  return <h3>Todo App ({useLeft()} todos left)</h3>;
}
