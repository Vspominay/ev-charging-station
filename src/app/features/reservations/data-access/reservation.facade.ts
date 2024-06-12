import { computed, inject, Injectable, Signal } from '@angular/core';
import { EMPTY_PLACEHOLDER } from '@core/constants/empty-placeholder.constant';
import { EventBus } from '@core/services/event-bus.service';
import {
  CancelReservationResponseStatus, ReservationCancellationProcessedMessage, ReservationEvent,
  ReservationProcessedMessage, ReserveNowResponseStatus
} from '@core/services/signalr.service';
import { ChargersStore } from '@features/chargers/data-access/chargers.store';
import { TCharger, TChargerWithConnectors } from '@features/chargers/data-access/models/charger.model';
import {
  TReservation, TUpsertReservation, TUpsertReservationRequest
} from '@features/reservations/data-access/models/reservation.model';
import { RESERVATION_CLIENT_GATEWAY, ReservationStore } from '@features/reservations/data-access/reservation.store';
import { IToastOptions, ToastService } from '@shared/components/toastr/toast-service';
import { adaptToLocalTime } from '@shared/utils/adapt-to-local-time.util';
import { from, take } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ReservationFacade {
  readonly #store = inject(ReservationStore);
  readonly #client = inject(RESERVATION_CLIENT_GATEWAY);

  private readonly eventBus = inject(EventBus);
  private readonly toastService = inject(ToastService);
  private readonly $chargersWithConnectors: Signal<Array<TChargerWithConnectors>> = inject(ChargersStore).chargersWithConnectors;

  readonly $entities: Signal<Array<TReservation>> = computed(() => {
    const reservations = this.#store.entities();

    return reservations.map((reservation) => this.adaptReservationToLocalTimezone(reservation));
  });

  constructor() {
    this.listenReserveEvent();
    this.listenCancelEvent();
  }

  private reservationGen = this.localReservationGenerator();

  create(reservation: TUpsertReservation) {
    const localReservationId = <string>this.reservationGen.next().value;

    this.#store.upsert({
      ...reservation,
      reservationId: '',
      transactionId: '',
      tagId: reservation.ocppTagId,
      status: 'active',
      isCancelled: false,
      id: localReservationId
    });

    this.#client.create(reservation as unknown as TUpsertReservationRequest)
        .pipe(take(1))
        .subscribe({
          error: () => {
            this.#store.localDelete(localReservationId);
          }
        });
  }

  edit(reservationId: TReservation['id'], reservation: TUpsertReservation, fullReservation: TReservation) {
    const connectorId = this.getConnectorInChargeStation(reservation.chargePointId, reservation.connectorId)?.connectorId;
    if (connectorId === undefined) return;

    const reservationPayload: TUpsertReservationRequest = {
      chargePointId: reservation.chargePointId,
      connectorId,
      startDateTime: reservation.startDateTime,
      expiryDateTime: reservation.expiryDateTime,
      name: reservation.name,
      description: reservation.description,
      ocppTagId: reservation.ocppTagId
    };

    this.#client.update(reservationId, reservationPayload)
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.#store.upsert({
              ...fullReservation,
              ...reservation
            });
          },
        });
  }

  delete(reservationId: TReservation['id']) {
    from(Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Yes, delete it!',
    }))
      .pipe(
        filter((result) => result.isConfirmed),
        switchMap(() => this.#client.cancel(reservationId))
      )
      .subscribe({
        next: (isDeleted) => {
          if (!isDeleted) return;

          this.#store.localDelete(reservationId);
          Swal.fire('Deleted!', `Reservation has been deleted.`, 'success');
        }
      });
  }

  listenReserveEvent() {
    return this.eventBus.on(ReservationEvent.ReservationProcessed, (data: ReservationProcessedMessage) => {
      const charger = this.$chargersWithConnectors().find(charger => charger.id === data.chargePointId);
      if (!charger) return;

      const connector = charger.connectors.find(connector => connector.id === data.connectorId);
      if (!connector) return;

      const params = {
        connector: connector.connectorId,
        charger: charger.name || EMPTY_PLACEHOLDER
      };
      const { message, ...config } = this.getToastReserveNowStatus(data.status);

      this.toastService.show(message, { ...config, params });
    });
  }

  private listenCancelEvent() {
    return this.eventBus.on(ReservationEvent.ReservationCancellationProcessed, (data: ReservationCancellationProcessedMessage) => {
      const charger = this.$chargersWithConnectors().find(charger => charger.id === data.chargePointId);
      if (!charger) return;

      const connector = charger.connectors.find(connector => connector.id === data.connectorId);
      if (!connector) return;

      const params = {
        connector: connector.connectorId,
        charger: charger.name || EMPTY_PLACEHOLDER
      };
      const { message, ...config } = this.getToastCancelReservationStatus(data.status);

      this.toastService.show(message, { ...config, params });
    });
  }

  private adaptReservationToLocalTimezone(reservation: TReservation): TReservation {
    return {
      ...reservation,
      startDateTime: adaptToLocalTime(reservation.startDateTime),
      expiryDateTime: adaptToLocalTime(reservation.expiryDateTime)
    };
  }

  private getToastCancelReservationStatus(status: CancelReservationResponseStatus): IToastOptions & {
    message: string
  } {
    const configByStatus: Record<CancelReservationResponseStatus, IToastOptions & { message: string }> = {
      [CancelReservationResponseStatus.Accepted]: {
        message: 'reservation.events.cancel.accepted',
        style: 'success',
        iconName: 'schedule'
      },
      [CancelReservationResponseStatus.Rejected]: {
        message: 'reservation.events.cancel.rejected',
        style: 'danger',
        iconName: 'event_busy'
      }
    };

    return configByStatus[status];
  }

  private getToastReserveNowStatus(status: ReserveNowResponseStatus): IToastOptions & { message: string } {
    const configByStatus: Record<ReserveNowResponseStatus, IToastOptions & { message: string }> = {
      [ReserveNowResponseStatus.Accepted]: {
        message: 'reservation.events.accepted',
        style: 'success',
        iconName: 'schedule'
      },
      [ReserveNowResponseStatus.Faulted]: {
        message: 'reservation.events.faulted',
        style: 'danger',
        iconName: 'battery_error'
      },
      [ReserveNowResponseStatus.Occupied]: {
        message: 'reservation.events.occupied',
        style: 'warning',
        iconName: 'event_busy'
      },
      [ReserveNowResponseStatus.Rejected]: {
        message: 'reservation.events.rejected',
        style: 'danger',
        iconName: 'event_busy'
      },
      [ReserveNowResponseStatus.Unavailable]: {
        message: 'reservation.events.unavailable',
        style: 'dark',
        iconName: 'power_off'
      }
    };

    return configByStatus[status];
  }

  private* localReservationGenerator() {
    let counter = 0;
    while (true) {
      const timestamp = Date.now();
      yield `${timestamp}-${counter++}`;

      if (counter > 9999) {
        counter = 0;
      }
    }
  }

  private getConnectorInChargeStation(chargerId: TCharger['id'], connectorId: string) {
    return this.$chargersWithConnectors().find((charger) => charger.id === chargerId)?.connectors.find((connector) => connector.id === connectorId);
  }
}
