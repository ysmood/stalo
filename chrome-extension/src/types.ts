export const eventInit = "stalo-init";
export const eventRecord = "stalo-record";
export const eventUpdate = "stalo-update";

export interface StaloEvent extends Event {
  detail: string;
}
