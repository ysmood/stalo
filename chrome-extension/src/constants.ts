export const namespace = "@@stalo";
export const eventConnect = "@@stalo-connect";
export const eventInit = "@@stalo-init";
export const eventRecord = "@@stalo-record";
export const eventSet = "@@stalo-set";

type StoreRecord<T> = {
  name: string;
  state: T;
  description?: string;
  createdAt: number;
};

export type Init = {
  sessionID: string;
  name: string;
  record: StoreRecord<string>;
};

export type Set = {
  id: string;
  state: string;
};

export type Record = {
  id: string;
  record: StoreRecord<string | undefined>;
};
