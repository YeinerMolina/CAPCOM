export interface IDropDownConfig<T> {
  name: string;
  value: T;
}

export type IDropDownConfigNumber = IDropDownConfig<number>;
