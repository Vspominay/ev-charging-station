import { NgControl } from '@angular/forms';

export abstract class FormElementAbstraction {
  id!: string;
  ngControl?: NgControl | null;
}
