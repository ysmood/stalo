import { getDevtools } from "stalo/lib/devtools";
import { plug, Connection } from "./store";

export default function connect() {
  const list = getDevtools();

  if (!list) return;

  list.forEach((dt, i) => {
    const conn: Connection = {
      id: i,
      name: dt.name,
      setState(json) {
        dt.state = JSON.parse(json);
      },
    };

    plug(conn);

    conn.onInit?.(dt.initRecord);

    dt.subscribe((rec) => {
      conn.onRecord?.(rec);
    });
  });
}
