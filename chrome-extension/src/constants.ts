import type { StoreRecord } from "stalo/lib/devtools";

export const namespace = "@@stalo";
export const eventConnect = "@@stalo-connect";
export const eventInit = "@@stalo-init";
export const eventRecord = "@@stalo-record";
export const eventSet = "@@stalo-set";
export const eventGet = "@@stalo-get";

export type Init = {
  sessionID: string;
  name: string;
  record: StoreRecord<object>;
};

export type Get = string;

export type Set = {
  id: string;
  state: object;
};

export type Record = {
  id: string;
  record: StoreRecord<object>;
};
