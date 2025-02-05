import type { StoreRecord } from "stalo/lib/devtools";
import { newRecords } from "./records";

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

  current: -1, // the record index that reflects the current page state
  staging: "", // the current string in the editor
  diffMode: false,

  selected: -1, // the record index that is selected in the record list
  records: newRecords(),

  // Don't use number type for scrollTo because we want react-window to scroll even if the value is the same.
  scrollTo: { val: 0 },
};

export type Session = typeof emptySession;

export const initStore = {
  currSessionId: "",
  sessions: {} as Record<string, Session>,
};

export const recordHeight = 42;

export const bufferDelay = 100;
