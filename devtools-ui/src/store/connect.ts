import { onDevtools, encode } from "stalo/lib/devtools";
import { plug, unplug } from ".";
import { Connection } from "./constants";
import { initName } from "../constants";

export default function connect(stop: AbortSignal) {
  stop.addEventListener(
    "abort",
    onDevtools((d) => {
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
    })
  );
}
