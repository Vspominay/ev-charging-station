import { NgClass } from '@angular/common';
import {
  AfterViewInit, ChangeDetectorRef, Component, computed, effect, inject, OnInit, TemplateRef, ViewChild
} from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TReservation, TUpsertReservation } from '@features/reservations/data-access/models/reservation.model';
import { RESERVATION_CLIENT_GATEWAY, ReservationStore } from '@features/reservations/data-access/reservation.store';
import {
  UpsertReservationComponent
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
import { filter, switchMap, take } from 'rxjs';
import { tap } from 'rxjs/operators';
// Sweet Alert
import Swal from 'sweetalert2';

// Calendar Services
// import { restApiService } from "../../../core/services/rest-api.service";
import { category } from './data';

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

/**
 * Calendar Component
 */
export default class CalendarComponent implements OnInit, AfterViewInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  readonly #store = inject(ReservationStore);
  readonly #client = inject(RESERVATION_CLIENT_GATEWAY);

  readonly $reservations = computed<Array<EventInput>>(() => {
    const reservations = this.#store.entities();

    console.log(reservations);

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
    start: dayjs().add(4, 'hours').toISOString(),
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
    initialEvents: [],
    weekends: true,
    editable: true,
    selectable: true,
    validRange: this.validRange,
    select: this.openModal.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    eventResize: this.handleResize.bind(this),
    eventDragStop: this.handleResize.bind(this),
  };

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  // calendar
  calendarEvents!: EventInput[];
  editEvent: any;
  formEditData!: UntypedFormGroup;
  newEventDate: any;
  category!: any[];
  submitted = false;

  // Calendar click Event
  formData!: UntypedFormGroup;
  @ViewChild('editmodalShow') editmodalShow!: TemplateRef<any>;

  constructor(private modalService: NgbModal, private formBuilder: UntypedFormBuilder, private changeDetector: ChangeDetectorRef) {
    effect(() => {
      const reservations = this.$reservations();

      this.updateCalendarEvents(reservations);
    });
  }

  private updateCalendarEvents(events: EventInput[]) {
    if (!this.calendar) return;

    this.calendar.removeAllEvents();

    events.forEach((reservation) => {
      this.calendar.addEvent(reservation);
    });
  }

  ngAfterViewInit() {
    this.updateCalendarEvents(this.$reservations());
  }

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Apps' },
      { label: 'Calendar', active: true }
    ];

    // Validation
    this.formData = this.formBuilder.group({
      title: ['', [Validators.required]],
      category: ['', [Validators.required]],
      location: ['', [Validators.required]],
      description: ['', [Validators.required]],
      date: ['', Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required]
    });

    this._fetchData();
  }


  private get calendar() {
    return this.calendarComponent?.getApi();
  }


  /**
   * Fetches the data
   */
  private _fetchData() {
    this.category = category;
  }

  currentEvents: EventApi[] = [];

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
               tap((data: TUpsertReservation) => {
                 this.#store.upsert({
                   ...data,
                   reservationId: '',
                   transactionId: '',
                   tagId: data.ocppTagId,
                   status: 'active',
                   isCancelled: false,
                   id: ''
                 });
               }),
               switchMap((data: TUpsertReservation) => this.#client.create(data))
             )
             .subscribe();
  }

  private getLabels(isUpsert: boolean): Record<'label' | 'save', string> {
    return {
      label: isUpsert ? 'Edit Reservation' : 'Create Reservation',
      save: isUpsert ? 'Save' : 'Create'
    };
  }

  /**
   * Event click modal show
   */
  handleEventClick(clickInfo: EventClickArg) {
    const dialogRef = this.modalService.open(UpsertReservationComponent);
    const { tagId, startDateTime, expiryDateTime, ...reservation } = clickInfo.event.extendedProps as TReservation;

    console.log(clickInfo.event.extendedProps);

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
               switchMap((updatedReservation: TUpsertReservation) => this.#client.update(reservation.id, updatedReservation))
             )
             .subscribe((reservation) => {
               this.#store.upsert(reservation);
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

    this.#client.update(reservation.id, reservationUpsert)
        .subscribe((reservation) => {
          this.#store.upsert(reservation);
        });
  }

  /**
   * Events bind in calander
   * @param events events
   */
  handleEvents(events: EventApi[]) {

    this.currentEvents = events;
    // this.changeDetector.detectChanges();
  }

  /***
   * Model Position Set
   */
  position() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Event has been saved',
      showConfirmButton: false,
      timer: 1000,
    });
  }

  /***
   * Model Edit Position Set
   */
  Editposition() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Event has been Updated',
      showConfirmButton: false,
      timer: 1000,
    });
  }

  /**
   * Event Data Get
   */
  get form() {
    return this.formData.controls;
  }

  /**
   * Delete event
   */
  deleteEventData() {
    this.editEvent.remove();
    this.modalService.dismissAll();
  }
}
