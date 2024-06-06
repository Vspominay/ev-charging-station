import { computed, inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY_PLACEHOLDER } from '@core/constants/empty-placeholder.constant';
import { AuthClient, TTokenResponse } from '@features/auth/data-access/auth.client';
import { TLoginRequest } from '@features/auth/data-access/models/login.model';
import { TRegisterRequest } from '@features/auth/data-access/models/register.model';
import { TSessionUser } from '@features/auth/data-access/models/user.type';
import { SessionStore, STORAGE_TOKEN_KEY } from '@features/auth/data-access/session.store';
import { decodeJWT } from '@features/auth/utils/decode-jwt.util';
import { camelCaseToWords } from '@shared/utils/camel-to-words.utils';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthFacade {
  private readonly client = inject(AuthClient);
  private readonly store = inject(SessionStore);
  private readonly router = inject(Router);

  register(payload: TRegisterRequest) {
    return this.client.signUp(payload)
               .pipe(take(1))
               .subscribe({
                 next: token => this.handleSuccessAuth(token),
               });
  }

  login(payload: TLoginRequest) {
    return this.client.signIn(payload)
               .pipe(take(1))
               .subscribe({
                 next: token => this.handleSuccessAuth(token),
               });
  }

  logout() {
    this.store.reset();
    this.router.navigateByUrl('auth/login');
  }

  restoreSession() {
    const token = localStorage.getItem(STORAGE_TOKEN_KEY);

    if (token) {
      const user = this.adaptJwtToUser(token);
      this.updateSessionUser(user, token);
    }
  }

  $vm = computed(() => {
    const user = this.store.user();
    const isLoading = this.store.isLoading();

    return {
      user, isLoading
    };
  });

  private handleSuccessAuth({ token }: TTokenResponse) {
    const user = this.adaptJwtToUser(token);
    this.updateSessionUser(user, token);
    this.router.navigateByUrl('depots');
  }

  private updateSessionUser(user: TSessionUser, token: string) {
    this.store.setUser(user);
    this.store.setToken(token);
    this.store.setLoading(false);
  }

  private adaptJwtToUser(jwt: string): TSessionUser {
    const jwtData = decodeJWT(jwt);

    return {
      email: jwtData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ?? 'admin@gmail.com',
      roles: jwtData['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
      fullName: camelCaseToWords(jwtData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || EMPTY_PLACEHOLDER),
      id: jwtData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
    };
  }
}
