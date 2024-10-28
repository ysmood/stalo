export const namespace = "@@stalo";
export const eventConnect = "@@stalo-connect";
export const eventInit = "@@stalo-init";
export const eventRecord = "@@stalo-record";
export const eventSet = "@@stalo-set";

type StoreRecord = {
  name: string;
  state: string | undefined;
  description?: string;
  createdAt: number;
};

export type Init = {
  sessionID: string;
  name: string;
  record: StoreRecord;
};

export type Set = {
  id: string;
  state: string;
};

export type Record = {
  id: string;
  record: StoreRecord;
};
