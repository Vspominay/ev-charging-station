import { FormControl } from '@angular/forms';

import { OperatorFunction } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';

export const initSearchControl = (control: FormControl = new FormControl(''), ...operators: OperatorFunction<any, any>[]) => {
  const formControl = control;

  return {
    formControl,
    valueChanges$: formControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        map((value) => value.trim()),
        ...(operators as []),
      )
  };
};
