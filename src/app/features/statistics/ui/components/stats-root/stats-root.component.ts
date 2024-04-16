import { CommonModule, NgForOf } from '@angular/common';
import { Component } from '@angular/core';
import { NgbDropdown, NgbDropdownMenu, NgbDropdownToggle } from '@ng-bootstrap/ng-bootstrap';
import { getChartColorsArray } from '@shared/utils/get-chart-colors.util';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'ev-stats-root',
  standalone: true,
  imports: [CommonModule, NgbDropdown, NgbDropdownMenu, NgApexchartsModule, NgbDropdownToggle, NgApexchartsModule, NgbDropdown, NgbDropdownMenu, NgbDropdownToggle, NgApexchartsModule, NgForOf],
  templateUrl: './stats-root.component.html',
  styles: ``
})
export default class StatsRootComponent {
  VisitorChart: any;
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
        y: [{
          formatter: function (y: any) {
            if (typeof y !== 'undefined') {
              return y.toFixed(2) + 'kW';
            }
            return y;

          }
        }, {
          formatter: function (y: any) {
            if (typeof y !== 'undefined') {
              return y.toFixed(0) + 'kW';
            }
            return y;

          }
        }]
      }
    };
  }

  private _visitorChart(colors: any) {
    colors = getChartColorsArray(colors);
    this.VisitorChart = {
      series: [{
        data: [{
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
          show: false,
        },
      },
      colors: colors,
      plotOptions: {
        treemap: {
          distributed: true,
          enableShades: false,
        },
      },
    };
  }

  private _splineAreaChart(colors: any) {
    colors = getChartColorsArray(colors);
    this.splineAreaChart = {
      series: [{
        name: '',
        data: [33, 28, 30, 110, 150, 180, 35, 40, 55, 70, 210, 250].map(power => power * 10)
      },
      ],
      chart: {
        height: 320,
        type: 'area',
        toolbar: 'false',
      },
      dataLabels: {
        enabled: false
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
      }
    };
  }
}
