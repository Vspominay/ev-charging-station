import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TColorStyle } from '@core/types/color-style.type';
import { IconDirective } from '@shared/directives/icon.directive';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  template: `
    <div class="card">
      <div class="card-body d-flex">
        <div class="flex-grow-1">
          <h4>{{ value }}</h4>
          <h6 class="text-muted fs-13 mb-0">{{ label }}</h6>
        </div>

        <div class="flex-shrink-0 avatar-sm">
          <div class="avatar-title bg-{{style}}-subtle text-{{style}} fs-22 rounded">
            <i [icon]="icon"></i>
          </div>
        </div>
      </div>
    </div>
  `,
  imports: [
    IconDirective
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatsCardComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) value!: string;
  @Input({ required: true }) icon!: string;
  @Input() style: TColorStyle = 'warning';
}
