import { AUpsertEntity } from '@core/abstractions/base-upsert.abstraction';
import { TDepot } from '@features/depot/data-access/models/depot.model';
import { BehaviorSubject, Observable } from 'rxjs';

export class AddDepotStrategy extends AUpsertEntity<TDepot> {
  labels = {
    label: 'depot.upsert.add',
    save: 'base.buttons.save'
  };

  initialValue$: Observable<Partial<TDepot>> = new BehaviorSubject({}).asObservable();
}

export class EditDepotStrategy extends AUpsertEntity<TDepot> {
  labels = {
    label: 'depot.upsert.edit',
    save: 'base.buttons.save'
  };

  constructor(depotId: TDepot['id']) {
    super();
  }

  initialValue$: Observable<Partial<TDepot>> = new BehaviorSubject({}).asObservable();
}
