export function toArray<T>(item: Readonly<T[]>): Readonly<T[]>;
export function toArray<T>(item: T | T[]): T[];
export function toArray<T>(item: T | T[] | Readonly<T[]>): T[] | Readonly<T[]> {
  return Array.isArray(item) ? [...item] : [item as T];
}
