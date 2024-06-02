import { Injectable } from '@angular/core';

import { BaseCrudService } from '@core/services/base-crud.service';
import { TReservation, TUpsertReservation } from '@features/reservations/data-access/models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationClient extends BaseCrudService<TReservation, TUpsertReservation> {
  readonly domain = 'Reservation';

  // override update(id: string, payload: Partial<TUpsertReservation>): Observable<TReservation> {
  //   return this.http.put<TReservation>(`${this.reservationUrl}/${id}`, {
  //     ...payload,
  //     id
  //   });
  // }
}
