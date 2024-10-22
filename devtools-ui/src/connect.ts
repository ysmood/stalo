import { getDevtools } from "stalo/lib/devtools";
import { plug, unplug } from "./store";
import { Connection, initName } from "./store/constants";
import { uid } from "stalo/lib/utils";

export default function connect() {
  const list = getDevtools<object>();

  const closes: (() => void)[] = [];

  list.forEach((dt) => {
    const conn: Connection = {
      id: dt.id,
      name: dt.name,
      setState(state) {
        dt.state = state;
      },
      async getState() {
        return dt.state;
      },
    };

    plug(conn);

    conn.onInit?.({
      id: uid(),
      name: initName,
      state: dt.state,
      createdAt: Date.now(),
    });

    const close = dt.subscribe((rec) => {
      conn.onRecord?.(rec);
    });

    closes.push(() => {
      close();
      unplug(conn.id);
    });
  });

  return () => {
    closes.forEach((c) => c());
  };
}
