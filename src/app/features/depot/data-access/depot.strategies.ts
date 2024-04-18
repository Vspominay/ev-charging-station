import { inject } from '@angular/core';
import { AUpsertEntityStrategy } from '@core/abstractions/base-upsert.abstraction';
import { DepotClientService, TDepotResponse } from '@features/depot/data-access/depot.client';
import { TCreateDepot, TDepot } from '@features/depot/data-access/models/depot.model';
import { BehaviorSubject, Observable } from 'rxjs';

export abstract class AUpsertDepot extends AUpsertEntityStrategy<TDepot> {
  readonly clientGateway = inject(DepotClientService);

  abstract save(payload: Partial<TCreateDepot>): Observable<TDepotResponse>;

  initialValue$: Observable<Partial<TDepot>> = new BehaviorSubject({}).asObservable();
}

export class AddDepotStrategy extends AUpsertDepot {
  labels = {
    label: 'depot.upsert.add',
    save: 'base.buttons.save'
  };

  public save(payload: TCreateDepot) {
    return this.clientGateway.create(payload);
  }
}

export class EditDepotStrategy extends AUpsertDepot {
  labels = {
    label: 'depot.upsert.edit',
    save: 'base.buttons.save'
  };

  constructor(private depotId: TDepot['id']) {
    super();
  }

  public override save(payload: Partial<TDepot>) {
    return this.clientGateway.update(this.depotId, payload);
  }
}
