import { booleanAttribute } from '@angular/core';

export const normalizeFalsyObject = <T extends Record<string, any>>(obj: T): T => {
  return (Object.entries(obj) as Array<[keyof T, any]>).reduce((acc, [key, value]) => {
    if (typeof value !== 'boolean' && !booleanAttribute(value)) return acc;

    acc[key] = value;
    return acc;
  }, {} as T);
};
