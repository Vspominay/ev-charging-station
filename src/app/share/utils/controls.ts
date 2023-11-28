import { FormArray, FormControl, FormGroup } from '@angular/forms';

export type Controls<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends Record<any, any>
    ? FormGroup<Controls<T[K]>> | FormArray
    : FormControl<T[K]>;
};
