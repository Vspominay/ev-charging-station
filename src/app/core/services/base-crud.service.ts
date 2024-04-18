import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

type TListResponse<TEntity> = { collection: Array<TEntity> } & Array<TEntity>;

@Injectable({
  providedIn: 'root'
})
export abstract class BaseCrudService<TEntity, TUpsertEntity> {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl;
  protected abstract domain: string;

  getList(): Observable<TListResponse<TEntity>> {
    return this.http.post<TListResponse<TEntity>>(`${this.fullUrl}/getall`, {});
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

  private get fullUrl(): string {
    return `${this.baseUrl}${this.domain}`;
  }
}
