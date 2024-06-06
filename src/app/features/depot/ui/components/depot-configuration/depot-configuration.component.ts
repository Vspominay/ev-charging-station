import { CommonModule, NgForOf, NgOptimizedImage } from '@angular/common';
import { Component, effect, inject, numberAttribute, Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl, FormArray, FormRecord, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, ValidatorFn,
  Validators
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DepotStore } from '@features/depot/data-access/depot.store';
import { EnergyConsumptionFacade } from '@features/depot/data-access/facades/energy-consumption.facade';
import {
  TChargerLimit, TDepotEnergyIntervalView, TDepotViewConfiguration
} from '@features/depot/data-access/models/depot-configuration.model';
import { TDepotListItem } from '@features/depot/data-access/models/depot.model';
import { TimeRangesBuilderService, TTimeRange } from '@features/depot/data-access/services/time-ranges-builder.service';
import {
  DepotEnergyIntervalsComponent
} from '@features/depot/ui/components/depot-energy-intervals/depot-energy-intervals.component';
import {
  DepotEnergyUsageComponent
} from '@features/depot/ui/components/depot-energy-usage/depot-energy-usage.component';
import { DepotConfigChargerStatsPipe } from '@features/depot/ui/pipes/depot-config-charger-stats.pipe';
import {
  NgbDropdown, NgbDropdownMenu, NgbDropdownToggle, NgbNav, NgbNavContent, NgbNavItem, NgbNavLink, NgbNavOutlet
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbsComponent } from '@shared/components/breadcrumbs/breadcrumbs.component';
import { FormElementDirective } from '@shared/components/form-control/directives/form-element.directive';
import { FormControlComponent } from '@shared/components/form-control/form-control.component';
import { IconDirective } from '@shared/directives/icon.directive';
import { AddressPipe } from '@shared/pipes/address.pipe';
import { EmptyValuePipe } from '@shared/pipes/empty-value.pipe';
import { EnergyPipe } from '@shared/pipes/energy.pipe';
import { PowerPipe } from '@shared/pipes/power.pipe';
import { getFormControlsNames } from '@shared/utils/get-form-controls-names.util';
import { FlatpickrModule } from 'angularx-flatpickr';
import dayjs from 'dayjs';
import { NgxMaskDirective } from 'ngx-mask';

export type TDepotConfigForm = {
  general: Pick<TDepotViewConfiguration, 'depotEnergyLimit' | 'validFrom' | 'validTo'>;
  chargers: Record<TChargerLimit['chargePointId'], TChargerLimit['chargePointEnergyLimit']>;
  intervals: Array<TDepotEnergyIntervalView>;
};


const totalEnergyValidator = (maxEnergy: number): ValidatorFn => (control: AbstractControl) => {
  const value = (<FormArray>control)['value'] as Array<TDepotEnergyIntervalView>;

  const totalEnergy = value.reduce((acc, interval) => {
    return acc + numberAttribute(interval.energyLimit, 0);
  }, 0);

  return totalEnergy > maxEnergy ? { invalidTotalEnergy: totalEnergy - maxEnergy } : null;
};

const totalChargersPowerValidator = (maxPower: number): ValidatorFn => (control: AbstractControl) => {
  const value = Object.values(<FormRecord>control.value) as Array<TChargerLimit['chargePointEnergyLimit']>;

  const totalPower = value.reduce((acc, power) => {
    return acc + numberAttribute(power, 0);
  }, 0);

  return totalPower > maxPower ? { invalidTotalPower: true } : null;
};

@Component({
  selector: 'ev-depot-configuration',
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent, NgbNavItem, NgbNavLink, NgbNav, RouterLink, NgbNavOutlet, IconDirective, NgbNavContent, FormControlComponent, FormElementDirective, ReactiveFormsModule, FlatpickrModule, NgForOf, NgbDropdown, NgbDropdownMenu, NgbDropdownToggle, DepotEnergyUsageComponent, DepotEnergyIntervalsComponent, FormsModule, PowerPipe, AddressPipe, NgOptimizedImage, EmptyValuePipe, DepotConfigChargerStatsPipe, TranslateModule, NgxMaskDirective, EnergyPipe],
  templateUrl: './depot-configuration.component.html',
})
export default class DepotConfigurationComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly intervalBuilder = inject(TimeRangesBuilderService);

  private readonly energyConsumptionFacade = inject(EnergyConsumptionFacade);
  readonly $depot: Signal<TDepotListItem | null> = inject(DepotStore).currentEntity;
  readonly $chargerIdNameMap = this.energyConsumptionFacade.$chargerIdNameMap;

  breadCrumbItems!: Array<{}>;

  constructor() {
    this.listenDepotConfigChange();
    this.listenGeneralChanges();

    effect(() => {
      console.log(this.$depot());
    });
  }

  readonly form = this.fb.group({
    general: this.fb.group({
      depotEnergyLimit: this.fb.control(0, [Validators.required, Validators.min(0)]),
      validFrom: this.fb.control('', [Validators.required]),
      validTo: this.fb.control('', [Validators.required])
    }),
    chargers: this.fb.record<TChargerLimit['chargePointEnergyLimit']>({}),
    intervals: this.fb.array<TDepotEnergyIntervalView>([])
  });

  readonly formControlNames = getFormControlsNames(this.form);

  get generalForm() {
    return this.form.controls.general;
  }

  get intervalsArrayControl() {
    return this.form.controls.intervals;
  }

  get chargersArrayControl() {
    return this.form.controls.chargers;
  }

  get generalDepotRestrictions(): TDepotEnergyIntervalView {
    const { validFrom, validTo, depotEnergyLimit } = this.generalForm.value;

    return {
      startTime: dayjs(validFrom),
      endTime: dayjs(validTo),
      energyLimit: numberAttribute(depotEnergyLimit, 0) * 1000
    };
  }

  updateIntervals(intervals: Array<TDepotEnergyIntervalView>) {
    const { startTime, endTime, energyLimit } = this.generalDepotRestrictions;
    const timeRanges: Array<TTimeRange> = intervals.map(({ startTime, endTime, energyLimit }) => ({
      startTime,
      finishTime: endTime,
      power: energyLimit
    }));

    this.intervalsArrayControl.clear({ emitEvent: false });

    this.intervalBuilder.processTimeRanges(timeRanges, {
      startTime,
      finishTime: endTime,
      power: energyLimit
    }).forEach(({ startTime, finishTime, power }) => {
      this.intervalsArrayControl.push(this.fb.control({
        startTime,
        endTime: finishTime,
        energyLimit: power
      }), { emitEvent: false });
    });

    this.intervalsArrayControl.updateValueAndValidity();
  }

  saveConfig() {
    if (this.form.invalid) return;

    this.energyConsumptionFacade.save(this.form.value as TDepotConfigForm);
  }

  private listenDepotConfigChange() {
    effect(() => {
      const config = this.energyConsumptionFacade.$config();

      this.updateGeneralForm(config);
      this.updateIntervals(config.intervals);
      this.updateChargers(config.chargePointsLimits);
    });
  }

  private listenGeneralChanges() {
    this.generalForm.valueChanges.pipe(takeUntilDestroyed())
        .subscribe(({ depotEnergyLimit }) => {
          const energyLimit = numberAttribute(depotEnergyLimit, 0) * 1000;

          const intervalsControl = this.intervalsArrayControl;
          intervalsControl.setValidators(totalEnergyValidator(energyLimit));
          intervalsControl.updateValueAndValidity();

          const chargersControl = this.chargersArrayControl;
          chargersControl.setValidators(totalChargersPowerValidator(energyLimit));
          chargersControl.updateValueAndValidity();
        });
  }

  private updateGeneralForm({ depotEnergyLimit, validFrom, validTo }: TDepotViewConfiguration) {
    const energyLimit = numberAttribute(depotEnergyLimit, 0) / 1000;

    this.generalForm.setValue({
      depotEnergyLimit: energyLimit,
      validFrom,
      validTo
    });
  }

  private updateChargers(chargers: Array<TChargerLimit>) {
    this.chargersArrayControl.reset({}, { emitEvent: false });

    chargers.forEach(({ chargePointId, chargePointEnergyLimit }) => {
      this.chargersArrayControl.addControl(chargePointId, this.fb.control(chargePointEnergyLimit), { emitEvent: false });
    });

    this.chargersArrayControl.updateValueAndValidity();
  }
}
