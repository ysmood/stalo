import { useFilteredIDs } from "./store/filter";
import TodoItem from "./TodoItem";

// The component to display all filtered todos.
export default function Todos() {
  return (
    <>
      {useFilteredIDs().map((id) => {
        return <TodoItem key={id} id={id} />;
      })}
    </>
  );
}
