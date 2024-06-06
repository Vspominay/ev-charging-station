import { CommonModule, NgForOf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NgbDropdown, NgbDropdownMenu, NgbDropdownToggle } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { EnergyPipe } from '@shared/pipes/energy.pipe';
import { PowerPipe } from '@shared/pipes/power.pipe';
import { getChartColorsArray } from '@shared/utils/get-chart-colors.util';
import dayjs from 'dayjs';
import * as localizedFormat from 'dayjs/plugin/localizedFormat';
import { ApexAxisChartSeries, NgApexchartsModule } from 'ng-apexcharts';
import { forkJoin, take } from 'rxjs';
import { map } from 'rxjs/operators';

dayjs.extend(localizedFormat);

@Component({
  selector: 'ev-stats-root',
  standalone: true,
  imports: [CommonModule, NgbDropdown, NgbDropdownMenu, NgApexchartsModule, NgbDropdownToggle, NgApexchartsModule, NgbDropdown, NgbDropdownMenu, NgbDropdownToggle, NgApexchartsModule, NgForOf],
  templateUrl: './stats-root.component.html',
  styles: ``
})
export default class StatsRootComponent {
  EnergyUsageChart: any;
  splineAreaChart: any;
  OverviewChart: any;

  constructor() {
    this._visitorChart(['--vz-primary', '--vz-primary-rgb, 0.65', '--vz-secondary', '--vz-secondary-rgb, 0.75', '--vz-primary-rgb, 0.4', '--vz-success']);
    this._splineAreaChart(['--vz-primary', '--vz-primary-rgb, 0.65', '--vz-secondary', '--vz-secondary-rgb, 0.75', '--vz-primary-rgb, 0.4', '--vz-success']);
    this._OverviewChart(['--vz-primary', '--vz-secondary', '--vz-danger']);

  }

  private _OverviewChart(colors: any) {
    colors = getChartColorsArray(colors);
    this.OverviewChart = {
      series: [
        {
          name: 'Actual consumption',
          type: 'bar',
          data: [34, 65, 46, 68, 49, 61, 42, 44, 78, 52, 63, 67]
        }, {
          name: 'Expected consumption',
          type: 'area',
          data: [89.25, 98.58, 68.74, 108.87, 77.54, 84.03, 51.24, 28.57, 92.57, 42.36, 88.51, 36.57]
        }
      ],
      chart: {
        height: 374,
        type: 'line',
        toolbar: {
          show: false,
        }
      },
      stroke: {
        curve: 'smooth',
        dashArray: [0, 3, 0],
        width: [0, 1, 0],
      },
      fill: {
        opacity: [1, 0.1, 1]
      },
      markers: {
        size: [0, 4, 0],
        strokeWidth: 2,
        hover: {
          size: 4,
        }
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        axisTicks: {
          show: false
        },
        axisBorder: {
          show: false
        }
      },
      grid: {
        show: true,
        xaxis: {
          lines: {
            show: true,
          }
        },
        yaxis: {
          lines: {
            show: false,
          }
        },
        padding: {
          top: 0,
          right: -2,
          bottom: 15,
          left: 10
        },
      },
      legend: {
        show: true,
        horizontalAlign: 'center',
        offsetX: 0,
        offsetY: -5,
        markers: {
          width: 9,
          height: 9,
          radius: 6,
        },
        itemMargin: {
          horizontal: 10,
          vertical: 0
        },
      },
      plotOptions: {
        bar: {
          columnWidth: '30%',
          barHeight: '70%'
        }
      },
      colors: colors,
      tooltip: {
        shared: true,
        theme: 'dark',
        y: [{
          formatter: function (y: any) {
            if (typeof y !== 'undefined') {
              return new EnergyPipe().transform(y);
            }
            return y;

          }
        }, {
          formatter: function (y: any) {
            if (typeof y !== 'undefined') {
              return new EnergyPipe().transform(y);
            }
            return y;

          }
        }]
      }
    };
  }

  private _visitorChart(colors: any) {
    colors = getChartColorsArray(colors);
    this.EnergyUsageChart = {
      series: [{
        data: [
          {
            x: '123ASD',
            y: 321
          },
          {
            x: '123ASD1',
            y: 165
          },
          {
            x: '123ASD2',
            y: 184
          },
          {
            x: '123ASD3',
            y: 123
          },
          {
            x: '123ASD4',
            y: 321
          },
          {
            x: '123ASD5',
            y: 165
          },
          {
            x: '123ASD6',
            y: 184
          },
          {
            x: '123ASD7',
            y: 123
          },
          {
            x: '123ASD8',
            y: 321
          },
          {
            x: '123ASD9',
            y: 165
          },
          {
            x: '123ASD10',
            y: 184
          },
          {
            x: '123ASD11',
            y: 123
          },
          {
            x: '123ASD12',
            y: 321
          },
        ]
      }],
      legend: {
        show: false,
      },
      chart: {
        height: 350,
        type: 'treemap',
        toolbar: {
          show: true,
          tools: {
            download: true,
            reset: false
          },
          export: {
            csv: {
              filename: 'Energy Usage Details',
              columnDelimiter: ',',
              headerCategory: 'Charger Name',
              headerValue: 'Energy Usage (Wh)'
            }
          }
        },
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: function (val: any) {
            return new EnergyPipe().transform(val);
          }
        }
      },
      colors: colors,
      plotOptions: {
        treemap: {
          distributed: true,
          enableShades: false,
        },
      },
    };

    // Add a custom button for exporting the CSV
    this.EnergyUsageChart.chart.toolbar.tools.customIcons = [{
      icon: '<i class="fa fa-download"></i>',
      index: -1,
      title: 'Download CSV',
      click: this.exportEnergyUsageCsv.bind(this)
    }];

  }

  private translateService = inject(TranslateService);

  private exportEnergyUsageCsv() {
    this.getLocalizedHeaders(['depot.config.chargers.charger-name', 'stats.energy-usage.title'])
        .pipe(
          take(1),
          map((headers) => {
            const data = this.getChartAxiesData(this.EnergyUsageChart.series);

            return [headers, data];
          }),
          map(([headers, data]) => [headers, data] as [string[], string[]])
        )
        .subscribe({
          next: (csvData) => this.downloadCsvContent(csvData)
        });
  };

  private getLocalizedHeaders(headerKeys: Array<string>) {
    return forkJoin(headerKeys.map(key => this.translateService.get(key)));
  }

  private getChartAxiesData(series: ApexAxisChartSeries) {
    return series[0].data.map((row: any) => [row.x, row.y]);
  }

  private downloadCsvContent(content: [string[], string[]]) {
    const csvContent = content.map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${this.getFileNameTimeRange()} .csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  private getFileNameTimeRange() {
    const start = dayjs().startOf('week');
    const end = dayjs().endOf('week');

    return [start, end].map((date) => date.format('LLL')).join(' - ');
  }


  private _splineAreaChart(colors: any) {
    colors = getChartColorsArray(colors);
    this.splineAreaChart = {
      series: [
        {
          name: '',
          data: [33, 28, 30, 110, 150, 180, 35, 40, 55, 70, 210, 250].map(power => power * 10)
        },
      ],
      chart: {
        height: 320,
        type: 'area',
        toolbar: {
          show: true,
        },
        export: {
          csv: {
            filename: 'power-consumption',
            columnDelimiter: ',',
            headerCategory: 'Month',
            headerValue: 'Power'
          },
        }
      },
      dataLabels: {
        enabled: false
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: function (val: any) {
            return new PowerPipe().transform(val);
          }
        }
      },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      colors: colors,
      fill: {
        opacity: 0.06,
        colors: colors,
        type: 'solid'
      },

    };
  }

  private readonly energyUsageData = {};


  private generatePowerConsumptionCsv() {

  }
}
