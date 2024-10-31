import type { StoreRecord } from "stalo/lib/devtools";
import History from "./history.class";

export interface Connection {
  id: string;
  name: string;
  setState(state: string): void;
  onInit?: (data: StoreRecord<string>) => void;
  onRecord?: (data: StoreRecord<string | undefined>) => void;
}

export const connections: { [key: string]: Connection } = {
  "": {
    id: "",
    name: "",
    setState: () => {},
  },
};

export const emptySession = {
  id: "", // connection id
  name: "none", // connection name

  staging: "",

  selected: -1,
  history: new History(),

  scrollTo: { val: 0 },
};

export type Session = typeof emptySession;

export const initStore = {
  currSession: "",
  sessions: {} as Record<string, Session>,
};

export const recordHeight = 42;

export const bufferDelay = 100;
