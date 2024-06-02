import { Injectable } from '@angular/core';
import { BaseCrudService, TListResponse } from '@core/services/base-crud.service';
import { TUser, TUserUpsert } from '@features/users/data-access/models/user.type';
import { hashCode } from '@shared/utils/get-hash.util';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersClient extends BaseCrudService<TUser, TUserUpsert> {
  readonly domain = 'User';

  public override getList(params?: Record<keyof Partial<TUser>, string> | {}): Observable<TListResponse<TUser>> {
    return super.getList(params)
                .pipe(
                  map((response) => ({
                    collection: this.addUserImages(response.collection)
                  }))
                );
  }

  private addUserImages(users: TUser[]) {
    return users.map((user) => ({ ...user, image: this.getImageByEmail(user.email) }));
  }

  private getImageByEmail(email: TUser['email']) {
    const index = hashCode(email) % this.images.length;
    return this.images[index];
  }

  private readonly images = Array.from({ length: 10 }, (_, i) => `assets/images/users/avatar-${i + 1}.jpg`);
}
