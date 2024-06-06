import { ChangeDetectionStrategy, Component, computed, inject, input, numberAttribute, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TColorStyle } from '@core/types/color-style.type';
import { TDepot } from '@features/depot/data-access/models/depot.model';
import { DepotMainPanelStatsPipe } from '@features/depot/ui/pipes/depot-main-panel-stats.pipe';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IconDirective } from '@shared/directives/icon.directive';
import { EnergyPipe } from '@shared/pipes/energy.pipe';
import { getChartColorsArray } from '@shared/utils/get-chart-colors.util';
import { getNextPowerValue } from '@shared/utils/get-next-power-value.util';
import { $getSelectedLanguage } from '@shared/utils/selected-language.util';
import dayjs from 'dayjs';
import {
  ApexAnnotations, ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexPlotOptions, ApexTooltip, ApexXAxis, ApexYAxis,
  NgApexchartsModule
} from 'ng-apexcharts';
import { distinctUntilChanged, interval } from 'rxjs';
import { map } from 'rxjs/operators';

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

  depot = input.required<TDepot>();
  powerUsage = input.required<number, number>({ transform: numberAttribute });

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
    { data: [this.powerUsage()] }
  ]);

  $annotations: Signal<ApexAnnotations> = computed(() => {
    const panelStyle = this.$panelStyle();
    const { energyLimit } = this.depot();

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
    const powerUsage = this.powerUsage();
    const [primary, danger] = this.colors;

    return powerUsage > numberAttribute(energyLimit, 0) ? danger : primary;
  });

  $xaxis: Signal<ApexXAxis> = computed(() => {
    const { energyLimit } = this.depot();
    const powerUsage = this.powerUsage();

    return { max: getNextPowerValue(Math.max(numberAttribute(energyLimit), powerUsage)) };
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
