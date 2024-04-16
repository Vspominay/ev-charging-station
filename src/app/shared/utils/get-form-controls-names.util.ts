import { FormGroup } from '@angular/forms';

type InferControls<T> = T extends FormGroup ? keyof Required<T['controls']> : never;

export function getFormControlsNames<T extends FormGroup>(formGroup: T): Record<InferControls<T>, string> {
  return (Object.keys(formGroup.controls) as Array<InferControls<T>>).reduce((acc, key) => {
    acc[key] = key as string;

    return acc;
  }, {} as Record<InferControls<T>, string>);
}
