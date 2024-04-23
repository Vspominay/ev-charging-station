export type PartialByKeys<T, K = keyof T> = Merge<
  {
    [P in keyof T as P extends K ? P : never]?: T[P];
  } & {
  [P in keyof T as P extends K ? never : P]: T[P];
}
>;

type Merge<T> = {
  [P in keyof T]: T[P];
};
