import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, Input, numberAttribute, TemplateRef, ViewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormArray, FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FIELD_MAX_LENGTH } from '@core/validators/field-max-length.validators';
import { trimRequiredValidator } from '@core/validators/trim-required.validator';
import {
  ChargingPhasesOptions, ChargingProfileKindOptions, ChargingProfilePurposeOptions, ChargingProfileRecurrencyOptions,
  ChargingRateUnitOptions
} from '@features/charging-profiles/contsants/profie-upsert.constants';
import {
  ChargingPhases, ChargingProfileKind, ChargingProfilePurpose, ChargingProfileRecurrency, ChargingRateUnit,
  TChargingProfile, TChargingSchedulePeriod, TUpsertChargingProfile
} from '@features/charging-profiles/data-access/models/charging-profile.model';
import { createEventId } from '@features/charging-profiles/ui/components/upsert-charging-profile/events.constant';
import { ScheduleUnitTranslationPipe } from '@features/charging-profiles/ui/pipes/schedule-unit-translation.pipe';
import { TimeRangesBuilderService, TTimeRange } from '@features/depot/data-access/services/time-ranges-builder.service';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateRangeInput, DateSelectArg, EventApi, EventClickArg } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import { ResourceInput } from '@fullcalendar/resource';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import {
  NgbActiveModal, NgbModal, NgbModalRef, NgbNav, NgbNavContent, NgbNavItem, NgbNavLink, NgbNavLinkBase, NgbNavOutlet
} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormElementDirective } from '@shared/components/form-control/directives/form-element.directive';
import { FormControlComponent } from '@shared/components/form-control/form-control.component';
import { IconDirective } from '@shared/directives/icon.directive';
import { getFormControlsNames } from '@shared/utils/get-form-controls-names.util';
import { ControlsOf } from '@shared/utils/types/controls-of.type';
import { FlatpickrModule } from 'angularx-flatpickr';
import dayjs, { Dayjs } from 'dayjs';
import { NgxMaskDirective } from 'ngx-mask';
import { combineLatest, filter, startWith, take } from 'rxjs';
import { debounceTime, map, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';

type TChargingSchedulePeriodControl = ControlsOf<Omit<TChargingSchedulePeriod, 'id'>>;
type TUpsertChargingProfileForm = Omit<ControlsOf<TUpsertChargingProfile>, 'chargingSchedulePeriods'> & {
  chargingSchedulePeriods: FormArray<FormControl<TChargingSchedulePeriodControl>>;
};

type TSchedulePeriod = {
  limit: number;
  phase: ChargingPhases;
};

@Component({
  selector: 'ev-upsert-charging-profile',
  standalone: true,
  imports: [CommonModule, FormControlComponent, FormElementDirective, IconDirective, NgbNav, NgbNavContent, NgbNavLink, NgbNavLinkBase, ReactiveFormsModule, TranslateModule, NgbNavItem, NgSelectModule, FlatpickrModule, NgxMaskDirective, NgbNavOutlet, FullCalendarModule, ScheduleUnitTranslationPipe],
  templateUrl: './upsert-charging-profile.component.html',
})
export class UpsertChargingProfileComponent {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  @ViewChild('upsertModal') upsertInterval!: TemplateRef<any>;

  private scheduleUnitTranslatePipe = new ScheduleUnitTranslationPipe();
  private translateService = inject(TranslateService);
  readonly dialog = inject(NgbActiveModal);
  readonly modalService = inject(NgbModal);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly intervalBuilder = inject(TimeRangesBuilderService);

  @Input() labels!: Record<'label' | 'save', string>;

  initTimeRanges: Array<TTimeRange> = [];

  @Input() set profile(value: TChargingProfile | null) {
    if (!value || !Object.keys(value).length) return;

    const { chargingSchedulePeriods, ...profile } = value;
    this.form.patchValue(profile);


    const timeRanges: Array<TTimeRange> = this.adaptChargingSchedulePeriodsToTimeRange(chargingSchedulePeriods);
    timeRanges.forEach((interval) => this.addEventFromTimeInterval(interval));
    this.initTimeRanges = timeRanges;

    if (!value.id) return;
    this.form.disable();
  }

  private adaptChargingSchedulePeriodsToTimeRange(periods: Array<TChargingSchedulePeriod>) {
    const timeRanges: TTimeRange[] = [];

    for (let i = 0; i < periods.length; i++) {
      const { startPeriod, limit } = periods[i];
      let finishTime: Dayjs;

      if (i + 1 < periods.length) {
        const nextPeriod = periods[i + 1];
        finishTime = dayjs().startOf('day').add(nextPeriod.startPeriod - 1, 'seconds');
      } else {
        finishTime = dayjs(timeRanges.at(-1)?.finishTime).endOf('day');
      }

      timeRanges.push({
        startTime: dayjs().startOf('day').add(startPeriod, 'seconds'),
        finishTime,
        power: limit
      });
    }

    return timeRanges;
  }

  private readonly MAX_DURATION = 86_400;

  readonly form = this.fb.group<TUpsertChargingProfileForm>({
    id: this.fb.control(''),
    name: this.fb.control('', [trimRequiredValidator, FIELD_MAX_LENGTH]),
    stackLevel: this.fb.control(1, [Validators.min(0), trimRequiredValidator]),
    validFrom: this.fb.control('', [Validators.required]),
    validTo: this.fb.control('', [Validators.required]),
    recurrencyKind: this.fb.control(ChargingProfileRecurrency.Daily, [Validators.required]),
    chargingProfilePurpose: this.fb.control(ChargingProfilePurpose.Default, [Validators.required]),
    chargingProfileKind: this.fb.control(ChargingProfileKind.Absolute, [Validators.required]),
    duration: this.fb.control(this.MAX_DURATION, [Validators.required, Validators.min(0)]),
    startSchedule: this.fb.control(dayjs().startOf('day').toISOString(), [trimRequiredValidator]),
    schedulingUnit: this.fb.control(ChargingRateUnit.Watts, [Validators.required]),
    minChargingRate: this.fb.control(0, [Validators.required, Validators.min(0)]),
    chargingSchedulePeriods: this.fb.array<TChargingSchedulePeriodControl>([]),
  });

  recurrencyOptions = ChargingProfileRecurrencyOptions;
  purposeOptions = ChargingProfilePurposeOptions;
  kindOptions = ChargingProfileKindOptions;
  unitOptions = ChargingRateUnitOptions;
  phasesOptions = ChargingPhasesOptions;

  readonly formControlNames = getFormControlsNames(this.form);

  readonly newPeriodForm = this.fb.group<ControlsOf<TSchedulePeriod>>({
    limit: this.fb.control(0, [Validators.required, Validators.min(0)]),
    phase: this.fb.control<ChargingPhases>(ChargingPhases.SinglePhase, [Validators.required])
  });
  readonly newPeriodControlNames = getFormControlsNames(this.newPeriodForm);

  resources: ResourceInput[] = [
    {
      id: '1',
    }
  ];
  currentEvents: EventApi[] = [];

  $validRange = toSignal<DateRangeInput>(
    combineLatest(
      this.form.controls.startSchedule.valueChanges,
      this.form.controls.duration.valueChanges,
    ).pipe(
      startWith([this.form.controls.startSchedule.value, this.form.controls.duration.value]),
      map(([startSchedule, duration]) => {
        let startDayJs = dayjs(startSchedule);

        startDayJs = (startDayJs.isValid() ? startDayJs : dayjs()).startOf('day');
        const normalizedDuration = Math.min(numberAttribute(duration, 0), this.MAX_DURATION);

        return {
          start: startDayJs.toISOString(),
          end: startDayJs.add(normalizedDuration, 'seconds').toISOString()
        };
      }),
    )
  );

  calendarVisible = true;
  $calendarOptions = computed<CalendarOptions>(() => {
    const validRange = this.$validRange();

    return {
      plugins: [
        resourceTimelinePlugin,
        interactionPlugin
      ],
      initialView: 'resourceTimelineDay',
      schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
      initialEvents: [],
      resources: this.resources,
      resourceAreaWidth: 0,
      headerToolbar: false,
      eventOverlap: false,
      nowIndicator: true,
      weekends: true,
      editable: !this.isProfileExist,
      selectable: !this.isProfileExist,
      selectMirror: true,
      dayMaxEvents: true,
      // validRange,
      select: this.handleDateSelect.bind(this),
      eventClick: this.handleEventClick.bind(this),
      eventsSet: this.handleEvents.bind(this),
    };
  });

  private get isProfileExist() {
    return !!this.form.getRawValue().id;
  }


  $defaultTimeRange = toSignal<TTimeRange | undefined>(
    combineLatest([
      this.form.controls.duration.valueChanges.pipe(startWith(this.form.value.duration)),
      this.form.controls.startSchedule.valueChanges.pipe(startWith(this.form.value.startSchedule)),
      this.form.controls.minChargingRate.valueChanges.pipe(startWith(this.form.value.minChargingRate)),
    ]).pipe(
      debounceTime(300),
      map(([duration, startSchedule, minChargingRate]) => {
        const startTime = dayjs(startSchedule).startOf('day');
        const finishTime = startTime.add(numberAttribute(duration, 0), 'seconds');
        const power = numberAttribute(minChargingRate, 0);

        return { startTime, finishTime, power };
      }),
      tap((timeRange) => console.log(timeRange))
    )
  );

  constructor() {
    effect(() => {
      const timeRange = this.$defaultTimeRange();

      if (!timeRange || !this.calendar) return;

      const intervals = this.initTimeRanges;

      if (!intervals.length) {
        this.calendar.removeAllEvents();
        this.addEventFromTimeInterval(timeRange);
        return;
      }

      const timeRanges = intervals.map((interval) => {
        return {
          ...interval,
          power: this.getValueInScope(interval.power, { min: timeRange.power, max: Number.MAX_VALUE }),
        };
      });
      this.calendar.removeAllEvents();
      timeRanges.forEach((interval) => this.addEventFromTimeInterval(interval));
    });
  }

  private get calendar() {
    return this.calendarComponent?.getApi();
  }

  get timeIntervals(): Array<TTimeRange> {
    const events = this.currentEvents;

    return events.map(this.adaptEventToTimeRange);
  }

  saveNewInterval(modal: NgbModalRef) {
    if (this.newPeriodForm.invalid) {
      modal.dismiss();
      return;
    }

    modal.close(this.newPeriodForm.getRawValue());
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.dialog.close({
      ...this.form.getRawValue(),
      chargingSchedulePeriods: this.timeIntervals.map((interval) => this.adaptTimeRangeToSchedulePeriod(interval))
    });
  }

  close() {
    this.dialog.dismiss();
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    if (this.isProfileExist) return;
    // const title = prompt('Please enter a new title for your event');
    // receive amount of power an phase using Swal dialog
    const dialogRef = this.modalService.open(this.upsertInterval);

    dialogRef.closed
             .pipe(
               take(1),
               filter(Boolean)
             )
             .subscribe((period: TSchedulePeriod) => {
               const calendarApi = selectInfo.view.calendar;
               const config = this.$defaultTimeRange();

               calendarApi.unselect(); // clear date selection

               if (config) {
                 const timeRanges = this.intervalBuilder.processTimeRanges(
                   [...this.timeIntervals, this.adaptEventToTimeRange({
                     end: selectInfo.end,
                     start: selectInfo.start,
                     extendedProps: { ...period }
                   })],
                   {
                     ...config,
                     power: Number.MAX_SAFE_INTEGER
                   }
                 );

                 this.calendar?.removeAllEvents();
                 timeRanges.forEach((interval) => this.addEventFromTimeInterval(interval));
               }
             });

  }

  private addEventFromTimeInterval(interval: TTimeRange) {
    this.calendar?.addEvent({
      id: createEventId(),
      resourceId: '1',
      title: this.getIntervalTitle(interval),
      start: interval.startTime.toISOString(),
      end: interval.finishTime.toISOString(),
      extendedProps: {
        limit: interval.power
      }
    });
  }

  private getIntervalTitle({ power }: TTimeRange) {
    const scheduleUnit = <ChargingRateUnit>this.form.value.schedulingUnit;
    const translateKey = this.scheduleUnitTranslatePipe.transform(scheduleUnit);

    return `${power} ${this.translateService.instant(translateKey)}`;
  }

  private handleEventClick(clickInfo: EventClickArg) {
    if (this.isProfileExist) return;

    Swal.fire({
      title: 'Delete interval?',
      text: `Are you sure you want to delete the ${clickInfo.event.title} interval?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (!result.value) return;

      const config = this.$defaultTimeRange() as TTimeRange;

      const timeRanges = this.intervalBuilder.processTimeRanges(
        [...this.timeIntervals],
        config
      );

      this.calendar.removeAllEvents();
      timeRanges.forEach((interval) => this.addEventFromTimeInterval(interval));
    });
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }

  private adaptEventToTimeRange(event: Pick<EventApi, 'start' | 'end' | 'extendedProps'>) {
    return {
      startTime: dayjs(event.start),
      finishTime: event.end ? dayjs(event.end) : dayjs(event.start).endOf('day'),
      power: numberAttribute(event.extendedProps['limit'], 0)
    };
  }

  private adaptTimeRangeToSchedulePeriod(timeRange: TTimeRange): Omit<TChargingSchedulePeriod, 'id'> {
    const startSchedule = dayjs(this.form.value.startSchedule).startOf('day');

    return {
      startPeriod: timeRange.startTime.diff(startSchedule, 'seconds'),
      limit: timeRange.power,
      numberPhases: this.newPeriodForm.value.phase ?? ChargingPhases.SinglePhase
    };
  }

  private getValueInScope(currentValue: string | number, restrict: Record<'min' | 'max', string | number>) {
    const value = numberAttribute(currentValue, 0);
    const min = numberAttribute(restrict.min, 0);
    const max = numberAttribute(restrict.max, 0);

    return Math.min(Math.max(value, min), max);
  }
}
