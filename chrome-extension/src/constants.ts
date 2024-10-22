export const namespace = "@@stalo";
export const eventInit = "@@stalo-init";
export const eventRecord = "@@stalo-record";
export const eventSet = "@@stalo-set";
export const eventGet = "@@stalo-get";

type Rec<S> = {
  id: string;
  name: string;
  state: S;
  description?: string;
  createdAt: number;
};

export type Init = {
  sessionID: string;
  name: string;
  record: Rec<object>;
};

export type Get = string;

export type Set = {
  id: string;
  state: object;
};

export type Record = {
  id: string;
  record: Rec<object>;
};
