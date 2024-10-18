import { getDevtools } from "stalo/lib/devtools";
import { plug, Connection } from "./store";

export default function connect() {
  const dt = getDevtools();

  if (!dt) return;

  const conn: Connection = {
    setState(json) {
      dt.state = JSON.parse(json);
    },
  };

  plug(conn);

  conn.onInit?.(dt.initRecord);

  dt.subscribe((rec) => {
    conn.onRecord?.(rec);
  });
}
