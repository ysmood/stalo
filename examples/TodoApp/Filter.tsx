import { useEffect } from "react";
import { setFilter } from "./store/filter";
import { filters } from "./store/filter/constants";

// The component to filter the todos.
export default function Filter() {
  useEffect(() => {});

  return (
    <select onChange={(e) => setFilter(e.target.value)}>
      {filters.map((f) => (
        <option key={f}>{f}</option>
      ))}
    </select>
  );
}
