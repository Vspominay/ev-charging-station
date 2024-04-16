import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseCrudService<TEntity> {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl;
  protected abstract domain: string;

  getList(): Observable<Array<TEntity>> {
    return this.http.post<Array<TEntity>>(`${this.fullUrl}/getall`, {});
  }

  getById(id: string): Observable<TEntity> {
    return this.http.get<TEntity>(`${this.fullUrl}/${id}`);
  }

  private get fullUrl(): string {
    return `${this.baseUrl}${this.domain}`;
  }
}
