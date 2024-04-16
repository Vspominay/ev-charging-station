import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  templateUrl: './breadcrumbs.component.html',
  imports: [
    NgClass
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadcrumbsComponent {
  @Input() title?: string;
  @Input() breadcrumbItems?: Array<{ active?: boolean; label: string; }> = [];
}
