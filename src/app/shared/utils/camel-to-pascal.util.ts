type CapitalizeObjectKeys<T extends object> = {
  [key in CapitalizeKeys<T>]: Capitalize<key> extends keyof T ? T[Capitalize<key>] : never;
}

type CapitalizeKeys<T extends object> = Capitalize<keyof T & string>;

export const upperCaseKeys = <T extends object>(obj: T): CapitalizeObjectKeys<T> => {
  const entries = Object.entries(obj);
  const mappedEntries = entries.map(
    ([k, v]) => [
      `${k[0].toUpperCase()}${k.slice(1)}`,
      upperCaseKeys(v)]
  );

  return Object.fromEntries(mappedEntries) as CapitalizeObjectKeys<T>;
};
