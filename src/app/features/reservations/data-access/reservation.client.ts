import { Injectable } from '@angular/core';

import { BaseCrudService } from '@core/services/base-crud.service';
import { TReservation, TUpsertReservationRequest } from '@features/reservations/data-access/models/reservation.model';
import { catchError, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservationClient extends BaseCrudService<TReservation, TUpsertReservationRequest> {
  readonly domain = 'Reservation';
  readonly reservationUrl = `${environment.baseUrl}${this.domain}`;

  override update(id: string, payload: Partial<TUpsertReservationRequest>): Observable<TReservation> {
    return this.http.put<TReservation>(`${this.reservationUrl}/${id}`, {
      ...payload,
      id
    });
  }

  cancel(reservationId: string): Observable<boolean> {
    return this.http.post(`${this.reservationUrl}/cancel`, { reservationId })
               .pipe(
                 map(() => true),
                 catchError(() => of(false))
               );
  }
}
