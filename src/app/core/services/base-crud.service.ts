import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export type TListResponse<TEntity> = { collection: Array<TEntity> };

@Injectable({
  providedIn: 'root'
})
export abstract class BaseCrudService<TEntity, TUpsertEntity> {
  protected readonly http = inject(HttpClient);
  protected readonly baseUrl = environment.baseUrl;
  protected abstract domain: string;

  getList(params?: Record<keyof Partial<TEntity>, string> | {}): Observable<TListResponse<TEntity>> {
    return this.http.post<TListResponse<TEntity>>(`${this.fullUrl}/getall`, params || {})
               .pipe(
                 catchError(() => (of({ collection: [] }))),
                 map((response) => {
                   if (!response) return { collection: [] };

                   return response;
                 })
               );
  }

  getById(id: string): Observable<TEntity> {
    return this.http.get<TEntity>(`${this.fullUrl}/${id}`);
  }

  create(entity: TUpsertEntity): Observable<TEntity> {
    return this.http.post<TEntity>(this.fullUrl, entity);
  }

  update(id: string, payload: Partial<TUpsertEntity>): Observable<TEntity> {
    return this.http.put<TEntity>(`${this.fullUrl}/${id}`, {
      ...payload,
      id
    });
  }

  delete(id: string) {
    return this.http.delete(`${this.fullUrl}/${id}`);
  }

  protected get fullUrl(): string {
    return `${this.baseUrl}${this.domain}`;
  }
}
