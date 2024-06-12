import { NgClass } from '@angular/common';
import { AfterViewInit, Component, computed, effect, inject, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TReservation, TUpsertReservation } from '@features/reservations/data-access/models/reservation.model';
import { ReservationFacade } from '@features/reservations/data-access/reservation.facade';
import {
  ReservationAction, UpsertReservationComponent
} from '@features/reservations/ui/components/upsert-reservation/upsert-reservation.component';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';

// Calendar option
import {
  CalendarOptions, DateRangeInput, DateSelectArg, EventApi, EventClickArg, EventInput
} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { EventDragStopArg, EventResizeDoneArg } from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';

// BootStrap
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BreadcrumbsComponent } from '@shared/components/breadcrumbs/breadcrumbs.component';
import { FlatpickrModule } from 'angularx-flatpickr';
import dayjs from 'dayjs';
import { filter, take } from 'rxjs';

@Component({
  selector: 'app-calendar',
  standalone: true,
  templateUrl: './calendar.component.html',
  imports: [
    BreadcrumbsComponent,
    FullCalendarModule,
    ReactiveFormsModule,
    NgClass,
    FlatpickrModule,
  ],
  styleUrls: ['./calendar.component.scss']
})
export default class CalendarComponent implements AfterViewInit {
  private readonly modalService = inject(NgbModal);

  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  private readonly facade = inject(ReservationFacade);
  currentEvents: EventApi[] = [];

  readonly $reservations = computed<Array<EventInput>>(() => {
    const reservations = this.facade.$entities();

    return reservations.map((reservation) => ({
      id: reservation.id,
      title: reservation.name,
      start: reservation.startDateTime,
      end: reservation.expiryDateTime,
      date: reservation.startDateTime,
      allDay: false,
      editable: true,
      durationEditable: true,
      interactive: true,
      name: reservation.name,
      extendedProps: reservation
    }));
  });

  private readonly validRange: DateRangeInput = {
    start: dayjs().toISOString(),
    end: dayjs().add(3, 'months').toISOString(),
  };

  readonly options: CalendarOptions = {
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
      center: 'title',
      right: 'prevYear,prev,next,nextYear'
    },
    initialView: 'dayGridMonth',
    themeSystem: 'bootstrap',
    nowIndicator: true,
    initialEvents: [],
    weekends: true,
    editable: true,
    selectable: true,
    validRange: this.validRange,
    select: this.openModal.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    eventResize: this.handleResize.bind(this),
    eventDrop: this.handleResize.bind(this),
  };

  constructor() {
    effect(() => {
      const reservations = this.$reservations();

      this.updateCalendarEvents(reservations);
    });
  }

  ngAfterViewInit() {
    this.updateCalendarEvents(this.$reservations());
  }

  get calendar() {
    return this.calendarComponent?.getApi();
  }

  /**
   * Event add modal
   */
  openModal(event: DateSelectArg) {
    const dialogRef = this.modalService.open(UpsertReservationComponent);

    Object.assign(dialogRef.componentInstance, {
      labels: this.getLabels(false),
      reservation: {
        startDateTime: event.start,
        expiryDateTime: event.end
      }
    });

    dialogRef.closed
             .pipe(
               filter(Boolean),
               take(1),
             )
             .subscribe((reservation) => {
               this.facade.create(reservation);
             });
  }

  /**
   * Event click modal show
   */
  handleEventClick(clickInfo: EventClickArg) {
    const dialogRef = this.modalService.open(UpsertReservationComponent);
    const fullReservation = clickInfo.event.extendedProps as TReservation;
    const { tagId, startDateTime, expiryDateTime, ...reservation } = fullReservation;

    Object.assign(dialogRef.componentInstance, {
      labels: this.getLabels(true),
      reservation: {
        ...reservation,
        ocppTagId: tagId,
        startDateTime: dayjs(startDateTime).toDate(),
        expiryDateTime: dayjs(expiryDateTime).toDate()
      }
    });

    dialogRef.closed
             .pipe(
               filter(Boolean),
               take(1),
             )
             .subscribe((upsertPayload: TUpsertReservation | { action: ReservationAction }) => {
               const isDeleteAction = (upsertPayload as {
                 action: ReservationAction
               }).action === ReservationAction.Delete;

               if (isDeleteAction) {
                 this.facade.delete(reservation.id);
               } else {
                 this.facade.edit(reservation.id, upsertPayload as TUpsertReservation, fullReservation);
               }
             });
  }

  handleResize(args: EventResizeDoneArg | EventDragStopArg) {
    const { event: { extendedProps, end, start } } = args;
    const reservation = extendedProps as TReservation;

    const reservationUpsert: TUpsertReservation = {
      ...reservation,
      startDateTime: dayjs(start).toISOString(),
      expiryDateTime: dayjs(end).toISOString(),
      ocppTagId: reservation.tagId
    };

    console.log(reservationUpsert, args.event.toJSON());

    this.facade.edit(reservation.id, reservationUpsert, reservation);
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }

  private updateCalendarEvents(events: EventInput[]) {
    if (!this.calendar) return;

    this.calendar.removeAllEvents();

    events.forEach((reservation) => {
      this.calendar.addEvent(reservation);
    });
  }

  private getLabels(isUpsert: boolean): Record<'label' | 'save', string> {
    return {
      label: isUpsert ? 'reservation.upsert.edit' : 'reservation.upsert.create',
      save: isUpsert ? 'base.buttons.save' : 'base.buttons.create'
    };
  }
}
