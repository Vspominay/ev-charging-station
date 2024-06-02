import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export interface IEventBusConfig<TData> {
  bus: EventBus<TData>,
  event: string;
}

export class EmitEvent<TData> {
  constructor(public event: string, public data: TData) {}
}

@Injectable({
  providedIn: 'root'
})
export class EventBus<TData> {
  private bus$$ = new Subject<EmitEvent<TData>>();

  emit(event: EmitEvent<TData>) {
    this.bus$$.next(event);
  }

  on(event: EmitEvent<TData>['event'], action: (data: TData) => void) {
    return this.bus$$.pipe(
      filter((e: EmitEvent<TData>) => e.event === event),
      map((e: EmitEvent<TData>) => e.data)
    ).subscribe(action);
  }
}
