export type DateValue =
  | string
  | number
  | Date
  | null
  | undefined
  | {
      seconds?: number;
      nanoseconds?: number;
      toDate?: () => Date;
    };
