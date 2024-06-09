import { ChangeDetectionStrategy, Component, computed, inject, input, numberAttribute, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TColorStyle } from '@core/types/color-style.type';
import { TDepotEnergyIntervalView } from '@features/depot/data-access/models/depot-configuration.model';
import { TDepotListItem } from '@features/depot/data-access/models/depot.model';
import { DepotMainPanelStatsPipe } from '@features/depot/ui/pipes/depot-main-panel-stats.pipe';
import { getCurrentInterval } from '@features/depot/utils/get-current-interval.util';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IconDirective } from '@shared/directives/icon.directive';
import { EnergyPipe } from '@shared/pipes/energy.pipe';
import { getChartColorsArray } from '@shared/utils/get-chart-colors.util';
import { getNextPowerValue } from '@shared/utils/get-next-power-value.util';
import { $getSelectedLanguage } from '@shared/utils/selected-language.util';
import dayjs from 'dayjs';

import utc from 'dayjs/plugin/utc';
import {
  ApexAnnotations, ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexPlotOptions, ApexTooltip, ApexXAxis, ApexYAxis,
  NgApexchartsModule
} from 'ng-apexcharts';
import { distinctUntilChanged, interval } from 'rxjs';
import { map } from 'rxjs/operators';

dayjs.extend(utc);

@Component({
  selector: 'app-depot-energy-usage',
  standalone: true,
  templateUrl: './depot-energy-usage.component.html',
  imports: [
    NgApexchartsModule,
    IconDirective,
    DepotMainPanelStatsPipe,
    TranslateModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepotEnergyUsageComponent {
  readonly colors = getChartColorsArray(['--vz-primary', '--vz-danger']);
  private readonly translate = inject(TranslateService);

  depot = input.required<TDepotListItem>();
  energyUsage = input.required<number>();

  $currentInterval = computed<TDepotEnergyIntervalView>(() => {
    const todayUtc = dayjs().utc();
    const depot = this.depot();

    const defaultInterval = {
      energyLimit: numberAttribute(depot.energyLimit, 0),
      startTime: todayUtc.clone().startOf('day'),
      endTime: todayUtc.clone().endOf('day')
    };

    return getCurrentInterval(depot) ?? defaultInterval;
  });


  $language = $getSelectedLanguage();

  $currentTime = toSignal(interval(1000)
    .pipe(
      map(() => dayjs().minute()),
      distinctUntilChanged(),
      map(() => dayjs().valueOf())
    ), {
    initialValue: dayjs().valueOf()
  });

  $series: Signal<ApexAxisChartSeries> = computed(() => [
    { data: [this.energyUsage()] }
  ]);

  $annotations: Signal<ApexAnnotations> = computed(() => {
    const panelStyle = this.$panelStyle();
    const energyLimit = this.$currentInterval().energyLimit;

    return {
      xaxis: [
        {
          x: numberAttribute(energyLimit),
          borderColor: panelStyle,
          label: {
            borderColor: panelStyle,
            style: {
              color: '#fff',
              background: panelStyle,
            },
            text: this.translate.instant('depot.stats.max-energy-usage'),
          },
        }
      ],
    };
  });

  $panelStyle = computed<TColorStyle>(() => {
    const { energyLimit } = this.depot();
    const energyUsage = this.energyUsage();
    const [primary, danger] = this.colors;

    return energyUsage > numberAttribute(energyLimit, 0) ? danger : primary;
  });

  $xaxis: Signal<ApexXAxis> = computed(() => {
    const { energyLimit } = this.depot();
    const energyUsage = this.energyUsage();

    return { max: getNextPowerValue(Math.max(numberAttribute(energyLimit), energyUsage)) };
  });

  chart: ApexChart = {
    type: 'bar',
    toolbar: {
      show: false
    },
    height: 180
  };


  yaxis: ApexYAxis = { show: false, axisBorder: { show: false } };

  tooltip: ApexTooltip = { enabled: false };

  datalabels: ApexDataLabels = {
    formatter: (val: string) => new EnergyPipe().transform(val),
  };

  plotOptions: ApexPlotOptions = {
    bar: { horizontal: true }
  };
}
