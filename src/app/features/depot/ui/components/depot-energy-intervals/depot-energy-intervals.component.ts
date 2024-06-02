import { CommonModule } from '@angular/common';
import {
  Component, computed, EventEmitter, inject, Input, numberAttribute, Output, signal, WritableSignal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl, FormControl, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators
} from '@angular/forms';
import { MONTH_SCOPE_DATE_FORMAT } from '@core/constants/date-format.constant';
import { TDepotEnergyIntervalView } from '@features/depot/data-access/models/depot-configuration.model';
import { TranslateModule } from '@ngx-translate/core';
import { FormElementDirective } from '@shared/components/form-control/directives/form-element.directive';
import { IconDirective } from '@shared/directives/icon.directive';
import { FlatpickrModule } from 'angularx-flatpickr';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { NgxMaskDirective } from 'ngx-mask';
import { filter, pairwise, startWith } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

dayjs.extend(customParseFormat);

type TFlatPickerRange = Record<'from' | 'to', Date | null>;
type TFlatEnergyRangeControl = {
  interval: FormControl<TFlatPickerRange>,
  limit: FormControl<number>
};
type TFlatEnergyRange = {
  interval: TFlatPickerRange,
  limit: number
};

export const validIntervalValidator = (control: AbstractControl) => {
  const { from, to } = control.value;

  if (!from || !to) {
    return { invalidInterval: true };
  }

  return from < to ? null : { invalidInterval: true };
};

export const minLimit = () => Validators.min(0);


@Component({
  selector: 'ev-depot-energy-intervals',
  standalone: true,
  imports: [CommonModule, FlatpickrModule, FormElementDirective, ReactiveFormsModule, IconDirective, NgxMaskDirective, NgxMaskDirective, FormsModule, TranslateModule],
  templateUrl: './depot-energy-intervals.component.html',
})
export class DepotEnergyIntervalsComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  readonly $intervalsRestriction: WritableSignal<TDepotEnergyIntervalView> = signal({
    energyLimit: 0,
    startTime: dayjs().startOf('day'),
    endTime: dayjs().endOf('day'),
  });

  readonly $dateRestrictions = computed(() => {
    const { startTime, endTime } = this.$intervalsRestriction();

    return {
      min: startTime.toDate(),
      max: endTime.toDate()
    };
  });

  private initialIntervals: Array<TDepotEnergyIntervalView> = [];

  @Input() set intervals(value: Array<TDepotEnergyIntervalView>) {
    const isSameIntervals = this.comparePlans(value, this.initialIntervals);
    if (isSameIntervals) return;

    this.intervalArray.clear({ emitEvent: false });
    this.initialIntervals = [...value];
    const intervals = this.adaptDepotEnergyIntervals(value ?? []);

    intervals.forEach(interval => {
      this.intervalArray.push(this.fb.group(interval), { emitEvent: false });
    });

    this.intervalArray.updateValueAndValidity();
  }

  @Input({ required: true }) set depotLimits(value: TDepotEnergyIntervalView) {
    this.$intervalsRestriction.set(value);
    this.updateIntervalsBasedOnLimits(value);
  }

  @Output() changeIntervals = new EventEmitter<Array<TDepotEnergyIntervalView>>();

  readonly intervalArray = this.fb.array<FormGroup<TFlatEnergyRangeControl>>(
    [],
    []
  );
  readonly newInterval = this.fb.group<TFlatEnergyRangeControl>({
    interval: this.fb.control({
      from: dayjs().startOf('day').toDate(),
      to: dayjs().endOf('day').toDate()
    }, { updateOn: 'blur', validators: [validIntervalValidator] }),
    limit: this.fb.control(0, [minLimit()])
  });

  constructor() {
    this.intervalArray.valueChanges
        .pipe(
          debounceTime(300),
          startWith(this.intervalArray.value),
          pairwise(),
          map(([prev, current]) => prev.length ? this.getUpdatedIntervals(prev as TFlatEnergyRange[], current as TFlatEnergyRange[]) : current as TFlatEnergyRange[]),
          map((intervals) => this.adaptFlatEnergyIntervals(intervals)),
          filter((intervals) => !this.comparePlans(this.initialIntervals, intervals)),
          distinctUntilChanged((prev, current) => this.comparePlans(prev, current)),
          takeUntilDestroyed()
        )
        .subscribe((intervals) => {
          this.changeIntervals.emit(intervals);
        });
  }

  addInterval(startInterval: dayjs.Dayjs = dayjs().startOf('day')) {
    const lastInterval = this.newInterval;

    if (lastInterval.invalid) return;

    const startDate = lastInterval ? dayjs(lastInterval.value.interval?.from) : dayjs(startInterval);
    const endDate = lastInterval ? dayjs(lastInterval.value.interval?.to) : dayjs(startInterval).endOf('day');

    const control = this.fb.group(
      this.getEmptyInterval(startDate, endDate, lastInterval.value.limit || 0)
    );

    this.intervalArray.push(control);
    this.newInterval.reset({
      interval: {
        from: null,
        to: null
      },
      limit: 0
    });
  }

  formatDateFn = (interval: string) => dayjs(interval).format(MONTH_SCOPE_DATE_FORMAT);
  parseDateFn = (interval: string) => dayjs(interval, MONTH_SCOPE_DATE_FORMAT).toDate();

  removeInterval(index: number) {
    this.intervalArray.removeAt(index);
    this.intervalArray.updateValueAndValidity();
  }


  private updateIntervalsBasedOnLimits(depotLimits: TDepotEnergyIntervalView) {
    const { startTime, endTime, energyLimit } = depotLimits;
    const planControls = this.intervalArray.controls;

    if (planControls.length < 1) {
      planControls.push(this.fb.group(this.getEmptyInterval(startTime, endTime, energyLimit)));
      return;
    }

    for (const interval of this.intervalArray.controls) {
      const { limit } = interval.value as TFlatEnergyRange;
      interval.patchValue({
        limit: limit > energyLimit ? energyLimit : limit
      }, { emitEvent: false });
    }

    this.intervalArray.updateValueAndValidity();
  }

  private comparePlans(prevIntervals: Array<TDepotEnergyIntervalView>, currentIntervals: Array<TDepotEnergyIntervalView>) {
    if (prevIntervals.length !== currentIntervals.length) return false;

    return prevIntervals.every((prevInterval, index) => this.compareIntervals(prevInterval, currentIntervals[index]));
  }

  private compareIntervals(interval1: TDepotEnergyIntervalView, interval2: TDepotEnergyIntervalView) {
    return interval1.startTime.isSame(interval2.startTime) && interval1.endTime.isSame(interval2.endTime) && numberAttribute(interval1.energyLimit) === numberAttribute((interval2.energyLimit));
  }

  private getUpdatedIntervals(prevIntervals: Array<TFlatEnergyRange>, currentIntervals: Array<TFlatEnergyRange>) {
    const isAdded = prevIntervals.length < currentIntervals.length;
    const isDeleted = prevIntervals.length > currentIntervals.length;

    if (isAdded || isDeleted) return currentIntervals;

    const updatedIntervalIndex = currentIntervals.findIndex((interval, index) => {
      const prevInterval = prevIntervals[index];
      return !dayjs(prevInterval.interval.from).isSame(interval.interval.from) ||
        dayjs(prevInterval.interval.to).isSame(interval.interval.to) ||
        numberAttribute(prevInterval.limit) !== numberAttribute(interval.limit);
    });

    if (updatedIntervalIndex === -1) return currentIntervals;

    const updatedIntervals = [...currentIntervals];
    const updatedInterval = updatedIntervals.splice(updatedIntervalIndex, 1);

    updatedIntervals.push(updatedInterval[0]);

    return updatedIntervals;
  }

  log(ev: any) {
    console.log(ev);
  }

  private getEmptyInterval(
    startDate: dayjs.Dayjs,
    endDate: dayjs.Dayjs,
    limit: number
  ): TFlatEnergyRangeControl {

    return this.adaptDepotEnergyIntervals([{
      startTime: startDate,
      endTime: endDate,
      energyLimit: limit
    }])[0];
  }

  private adaptDepotEnergyIntervals(intervals: Array<TDepotEnergyIntervalView>): Array<TFlatEnergyRangeControl> {
    return intervals.map(({ startTime, endTime, energyLimit }) => {
      return {
        interval: this.fb.control({
          from: dayjs(startTime).toDate(),
          to: dayjs(endTime).toDate()
        }, { updateOn: 'blur', validators: [validIntervalValidator] }),
        limit: this.fb.control(energyLimit, { validators: [minLimit()] })
      };
    });
  }

  private adaptFlatEnergyIntervals(intervals: Array<TFlatEnergyRange>): Array<TDepotEnergyIntervalView> {
    return intervals.map(({ interval, limit }) => {
      return {
        startTime: dayjs(interval.from),
        endTime: dayjs(interval.to),
        energyLimit: limit
      };
    });
  }
}
