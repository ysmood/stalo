import { StoreRecord } from "stalo/lib/devtools";
import { immutable } from "stalo/lib/utils";
import History from "./history.class";

export const initName = "@init";
export const commitName = "@commit";

export interface Connection {
  id: string;
  name: string;
  setState(state: object): void;
  onInit?: (data: StoreRecord<object>) => void;
  onRecord?: (data: StoreRecord<object>) => void;
}

export const emptySession = {
  id: "",
  name: "none",

  staging: "",
  getEditorValue: () => "",
  setEditorValue: (() => {}) as (value: string) => void,
  editorContent: "",

  selected: -1,
  history: new History(),

  connection: immutable<Connection>({
    id: "",
    name: "",
    setState: () => {},
  }),

  scrollTo: 0,
};

export type Session = typeof emptySession;

export const initStore = {
  currSession: "",
  sessions: {} as Record<string, Session>,
};

export const recordHeight = 42;

export const bufferDelay = 100;
