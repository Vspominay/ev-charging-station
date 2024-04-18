import { Observable } from 'rxjs';

export abstract class AUpsertEntityStrategy<TEntity> {
  abstract labels: Record<'label' | 'save', string>;
  abstract initialValue$: Observable<Partial<TEntity>>;
}
