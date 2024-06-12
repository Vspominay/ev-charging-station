import { Injectable } from '@angular/core';
import { EmitEvent, EventBus } from '@core/services/event-bus.service';
import { TConnector, TConnectorChangeMessage } from '@features/chargers/data-access/models/connector.model';
import {
  ChargingProfilePurpose, TChargingProfile
} from '@features/charging-profiles/data-access/models/charging-profile.model';
import { TReservation } from '@features/reservations/data-access/models/reservation.model';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../environments/environment';

export interface BaseMessage {
  chargePointId: string;
}

export interface StationConnectionMessage extends BaseMessage {
}

export enum ChargerEvent {
  Connection = 'StationConnection',
  Changes = 'ConnectorChanges',
  AutomaticDisable = 'ChargePointAutomaticDisable',
  ChangeAvailability = 'ChangeAvailability',
}

export enum TransactionEvent {
  Transaction = 'Transaction'
}

export interface TransactionMessage extends BaseMessage {
  connectorId: string;
  transactionId: number;
}


export interface ChargePointAutomaticDisableMessage extends BaseMessage {
  depotId: string;
}

// profile
export enum ProfileEvent {
  ChargingProfileSet = 'ChargingProfileSet',
  ChargingProfileCleared = 'ChargingProfileCleared',
}

export enum SetChargingProfileResponseStatus {
  Accepted,
  Rejected,
  NotSupported
}

export interface ChargingProfileSetMessage extends BaseMessage {
  connectorId: number;
  status: SetChargingProfileResponseStatus;
  chargingProfileId: string;
}

export interface ChargingProfileClearedMessage extends BaseMessage {
  status: ClearChargingProfileResponseStatus;
  chargingProfileId?: TChargingProfile['id'];
  connectorId?: number;
  chargingProfilePurpose?: ChargingProfilePurpose;
  stackLevel?: number;
}

export enum ClearChargingProfileResponseStatus {
  Accepted,
  Unknown
}

// depot
export enum DepotEvent {
  EnergyLimitExceeded = 'EnergyLimitExceeded'
}

export interface EnergyLimitExceededMessage extends BaseMessage {
  depotId: string;
  warningTimestamp: Date;
  energyConsumption: number;
  energyConsumptionLimit: number;
}

export enum ReservationEvent {
  ReservationProcessed = 'ReservationProcessed',
  ReservationCancellationProcessed = 'ReservationCancellationProcessed',
}

export interface ReservationProcessedMessage extends BaseMessage {
  reservationId: TReservation['id'];
  connectorId?: TConnector['id'];
  expiryDate: Date;
  status: ReserveNowResponseStatus;
}

export enum ReserveNowResponseStatus {
  Accepted,
  Faulted,
  Occupied,
  Rejected,
  Unavailable
}

export interface ReservationCancellationProcessedMessage extends BaseMessage {
  reservationId: TReservation['id'];
  connectorId?: TConnector['id'];
  status: CancelReservationResponseStatus;
}

export enum CancelReservationResponseStatus {
  Accepted,
  Rejected
}

export interface ChangeAvailabilityMessage extends BaseMessage {
  connectorId?: number;
  status: ChangeAvailabilityResponseStatus;
}

export enum ChangeAvailabilityResponseStatus {
  Accepted,
  Rejected,
  Scheduled
}

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private readonly hubConnection: signalR.HubConnection;

  constructor(private eventBus: EventBus<any>) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.signalR)
      .configureLogging(signalR.LogLevel.Information) // Enable detailed logging
      .build();

    this.startConnection();
    this.addListeners();
  }

  private startConnection() {
    console.log('Attempting to start SignalR connection...');
    this.hubConnection
        .start()
        .then(() => console.log('SignalR Connected'))
        .catch(err => {
          console.error('Error while starting connection:', err);
          setTimeout(() => this.startConnection(), 5000); // Retry connection after 5 seconds
        });
  }

  private addListeners() {
    this.hubConnection.on(ChargerEvent.Connection, (data: StationConnectionMessage) => {
      console.log('StationConnection: ', data);
      this.eventBus.emit(new EmitEvent(ChargerEvent.Connection, data));
    });

    this.hubConnection.on(ChargerEvent.Changes, (data: TConnectorChangeMessage) => {
      console.log('ConnectorChanges: ', data);
      this.eventBus.emit(new EmitEvent(ChargerEvent.Changes, data));
    });

    // charge profiles
    this.hubConnection.on(ProfileEvent.ChargingProfileSet, (data: ChargingProfileSetMessage) => {
      console.log('ChargingProfileSet: ', data);
      this.eventBus.emit(new EmitEvent(ProfileEvent.ChargingProfileSet, data));
    });

    this.hubConnection.on(ProfileEvent.ChargingProfileCleared, (data: ChargingProfileClearedMessage) => {
      console.log('ChargingProfileCleared: ', data);
      this.eventBus.emit(new EmitEvent(ProfileEvent.ChargingProfileCleared, data));
    });

    this.hubConnection.on(TransactionEvent.Transaction, (data: TransactionMessage) => {
      console.log('Transaction: ', data);
      this.eventBus.emit(new EmitEvent(TransactionEvent.Transaction, data));
    });

    this.hubConnection.on(DepotEvent.EnergyLimitExceeded, (data: EnergyLimitExceededMessage) => {
      console.log('EnergyLimitExceeded: ', data);
      this.eventBus.emit(new EmitEvent(DepotEvent.EnergyLimitExceeded, data));
    });

    this.hubConnection.on(ChargerEvent.AutomaticDisable, (data: ChargePointAutomaticDisableMessage) => {
      console.log('ChargePointAutomaticDisable: ', data);
      this.eventBus.emit(new EmitEvent(ChargerEvent.AutomaticDisable, data));
    });

    this.hubConnection.on(ReservationEvent.ReservationProcessed, (data: ReservationProcessedMessage) => {
      console.log('ReservationProcessed: ', data);
      this.eventBus.emit(new EmitEvent(ReservationEvent.ReservationProcessed, data));
    });

    this.hubConnection.on(ReservationEvent.ReservationCancellationProcessed, (data: ReservationCancellationProcessedMessage) => {
      console.log('ReservationCancellationProcessed: ', data);
      this.eventBus.emit(new EmitEvent(ReservationEvent.ReservationCancellationProcessed, data));
    });

    this.hubConnection.on(ChargerEvent.ChangeAvailability, (data: ChangeAvailabilityMessage) => {
      console.log('ChangeAvailability: ', data);
      this.eventBus.emit(new EmitEvent(ChargerEvent.ChangeAvailability, data));
    });
  }

  public stopConnection() {
    if (this.hubConnection) {
      this.hubConnection.stop().then(() => console.log('SignalR Disconnected'));
    }
  }
}
