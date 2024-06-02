import { inject, InjectionToken } from '@angular/core';
import { createGenericStore } from '@core/abstractions/base-store.store';
import { TReservation, TUpsertReservation } from '@features/reservations/data-access/models/reservation.model';
import { ReservationClient } from '@features/reservations/data-access/reservation.client';

export const RESERVATION_CLIENT_GATEWAY = new InjectionToken('RESERVATION_CLIENT_GATEWAY', {
  providedIn: 'root',
  factory: () => inject(ReservationClient)
});

export const ReservationStore = createGenericStore<TReservation, TUpsertReservation>(
  RESERVATION_CLIENT_GATEWAY,
  'Reservation'
);
