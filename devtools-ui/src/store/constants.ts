import { Record as Rec } from "stalo/lib/devtools";
import { immutable } from "stalo/lib/utils";
import { noName } from "stalo/lib/devtools";
import History from "./history";

export const initName = "@@init";
export const commitName = "@@commit";

export interface Connection {
  id: string;
  name: string;
  setState(state: object): void;
  getState(): Promise<object>;
  onInit?: (data: Rec<object>) => void;
  onRecord?: (data: Rec<object>) => void;
}

export const emptySession = {
  id: "",
  name: "none",
  selected: "",
  staging: "",
  getEditorValue: () => "",
  setEditorValue: (() => {}) as (value: string) => void,
  history: new History(),
  filter: "",
  connection: immutable<Connection>({
    id: "",
    name: noName,
    setState: () => {},
    getState: async () => ({}),
  }),
  recordScroll: 0,
};

export type Session = typeof emptySession;

export const initStore = {
  currSession: "",
  sessions: {} as Record<string, Session>,
};

export const recordHeight = 42;

export const bufferDelay = 100;
