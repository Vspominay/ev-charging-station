import { JsonPipe, NgOptimizedImage } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import { TPollList } from '../../../types';
import NewjobComponent from '../newjob/newjob.component';
import { PollService } from '../services/poll.service';

@Component({
  selector: 'app-companieslist',
  standalone: true,
  templateUrl: './companieslist.component.html',
  imports: [
    RouterLink,
    NewjobComponent,
    JsonPipe,
    ReactiveFormsModule,
    NgApexchartsModule,
    NgOptimizedImage,
    NewjobComponent,
  ]
})
export default class CompanieslistComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly pollService = inject(PollService);

  readonly $vm = this.pollService.$viewModel;
  $view = signal<'details' | 'create'>('details');

  voteForm = this.fb.group({
    selected: this.fb.control('', [Validators.required]),
  });

  constructor() {
    this._simpleDonutChart('["--vz-secondary", "--vz-danger", "--vz-primary"]');

    effect(() => {
      const poll = this.$vm().selectedPoll;
      const isVoted = poll?.voted;

      if (isVoted) {
        this.voteForm.disable();
      } else {
        this.voteForm.enable();
      }
    });
  }

  vote() {
    if (this.voteForm.invalid) return;

    const pollId = this.$vm().selectedPoll?.id;
    const selected = this.voteForm.value.selected;


    if (!pollId || selected === undefined) return;

    this.pollService.vote(pollId, Number(selected));
  }

  setPoll(pollId: TPollList['id']) {
    this.pollService.loadPoll(pollId);
  }

  toggleView() {
    this.$view.set(this.$view() === 'details' ? 'create' : 'details');
  }

  $banner = computed(() => {
    const isDetails = this.$view() === 'details';

    return {
      title: isDetails ? 'Let\'s build your own poll!' : 'Vote for your 🏆 poll!',
      button: isDetails ? 'Create' : 'Vote',
      style: isDetails ? 'success' : 'warning',
    };
  });

  simpleDonutChart: any;

  private getChartColorsArray(colors: any) {
    colors = JSON.parse(colors);
    return colors.map(function (value: any) {
      const newValue = value.replace(' ', '');
      if (newValue.indexOf(',') === -1) {
        let color = getComputedStyle(document.documentElement).getPropertyValue(newValue);
        if (color) {
          color = color.replace(' ', '');
          return color;
        } else return newValue;
      } else {
        const val = value.split(',');
        if (val.length == 2) {
          let rgbaColor = getComputedStyle(document.documentElement).getPropertyValue(val[0]);
          rgbaColor = 'rgba(' + rgbaColor + ',' + val[1] + ')';
          return rgbaColor;
        } else {
          return newValue;
        }
      }
    });
  }

  private _simpleDonutChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.simpleDonutChart = {
      chart: {
        type: 'donut',
        height: 219,
      },
      plotOptions: {
        pie: {
          donut: {
            size: '76%',
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
        position: 'bottom',
        horizontalAlign: 'center',
        offsetX: 0,
        offsetY: 0,
        markers: {
          width: 20,
          height: 6,
          radius: 2,
        },
        itemMargin: {
          horizontal: 12,
          vertical: 0
        },
      },
      stroke: {
        width: 0
      },
      colors: colors
    };
  }
}
