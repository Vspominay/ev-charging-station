import { Observable } from 'rxjs';

export abstract class AUpsertEntity<TEntity> {
  abstract labels: Record<'label' | 'save', string>;
  abstract initialValue$: Observable<Partial<TEntity>>;
}
