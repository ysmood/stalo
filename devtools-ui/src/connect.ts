import { Devtools, getDevtools } from "stalo/lib/devtools";
import { plug, unplug } from "./store";
import { Connection, initName } from "./store/constants";

export default async function connect(stop: AbortSignal) {
  const connected = new Set<Devtools<object>>();

  while (!stop.aborted) {
    getDevtools<object>().forEach((d) => {
      if (connected.has(d)) return;

      connected.add(d);

      const conn: Connection = {
        id: d.id,
        name: d.name,
        setState(state) {
          d.state = state;
        },
      };

      plug(conn);

      conn.onInit?.({
        name: initName,
        state: d.state,
        createdAt: Date.now(),
      });

      const close = d.subscribe((rec) => {
        conn.onRecord?.(rec);
      });

      stop.addEventListener("abort", () => {
        close();
        unplug(conn.id);
      });
    });

    await new Promise((r) => {
      const timer = setTimeout(r, 1000);
      stop.addEventListener("abort", () => clearTimeout(timer));
    });
  }
}
