import { Devtools, getDevtools, encode } from "stalo/lib/devtools";
import { plug, unplug } from ".";
import { Connection } from "./constants";
import { initName } from "../constants";

export default async function connect(stop: AbortSignal) {
  const connected = new Set<Devtools<unknown>>();

  while (!stop.aborted) {
    getDevtools<unknown>().forEach((d) => {
      if (connected.has(d)) return;

      connected.add(d);

      const conn: Connection = {
        id: d.id,
        name: d.name,
        setState(state) {
          d.state = JSON.parse(state);
        },
      };

      plug(conn);

      conn.onInit?.({
        name: initName,
        state: encode(d.state),
        createdAt: Date.now(),
      });

      const close = d.subscribe((rec) => {
        conn.onRecord?.({
          ...rec,
          state: rec.patch ? undefined : encode(rec.state),
        });
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