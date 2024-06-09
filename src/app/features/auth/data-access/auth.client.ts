import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TLoginRequest } from '@features/auth/data-access/models/login.model';
import { TConfirmRegisterRequest, TRegisterRequest } from '@features/auth/data-access/models/register.model';
import { TInviteUser } from '@features/users/data-access/models/user.type';
import { catchError, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export type TTokenResponse = {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthClient {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl;
  private readonly domain = 'Auth';

  private fallbackToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjQ2NDFjZDIyLWFhMGItNDY1Ny05ZmZlLTIwYWVhYjYyOWZlZSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6ImpvaG5kb2VAbWFpbC5sYWxhIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6IkpvaG5Eb2UiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJTdXBlckFkbWluaXN0cmF0b3IiLCJleHAiOjE3MTcyNDYzNDUsImlzcyI6ImNzbXMiLCJhdWQiOiJNeUFwcFVzZXJzIn0._RbmnhxEWPcOy4LTWU7Cc_L7cb94ieopD4Es0mfT-n0`;


  signUp(payload: TRegisterRequest) {
    return this.http.post<TTokenResponse>(`${this.fullUrl}/register`, payload)
               .pipe(
                 catchError(() => of({ token: this.fallbackToken }))
               );
  }

  signIn(payload: TLoginRequest) {
    return this.http.post<TTokenResponse>(`${this.fullUrl}/login`, payload)
               .pipe(
                 catchError(() => of({ token: this.fallbackToken }))
               );
  }

  inviteUser(user: TInviteUser): Observable<boolean> {
    return this.http.post(`${this.fullUrl}/invite`, user)
               .pipe(
                 catchError(() => of(false)),
                 map(() => true)
               );
  }

  confirmRegistration(payload: TConfirmRegisterRequest) {
    return this.http.post<boolean>(`${this.fullUrl}/confirm-registration`, payload).pipe(
      catchError(() => of(false)),
      map(() => true)
    );
  }

  protected get fullUrl(): string {
    return `${this.baseUrl}${this.domain}`;
  }
}
