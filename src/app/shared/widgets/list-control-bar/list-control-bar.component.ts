import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ActionPlacementPipe } from '@shared/components/card/action-placement.pipe';
import { IconDirective } from '@shared/directives/icon.directive';
import { initSearchControl } from '@shared/utils/init-search-control.util';
import { TViewActionItem } from '@shared/utils/types/actions.types';

@Component({
  selector: 'ev-list-control-bar',
  standalone: true,
  imports: [
    TranslateModule,
    IconDirective,
    FormsModule,
    ReactiveFormsModule,
    ActionPlacementPipe
  ],
  host: {
    class: 'd-block'
  },
  templateUrl: './list-control-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListControlBarComponent<TAction extends TViewActionItem<unknown, unknown>> {
  private readonly searchConfig = initSearchControl();
  readonly searchControl = this.searchConfig.formControl;

  @Input({ required: true }) actions: Array<TAction> = [];

  @Input() set searchString(value: string) {
    this.searchControl.setValue(value);
  }

  @Output() selectAction = new EventEmitter<TAction['value']>();
  @Output() changeSearch = new EventEmitter<string>();

  constructor() {
    this.searchConfig.valueChanges$
        .pipe(takeUntilDestroyed())
        .subscribe((searchString) => this.changeSearch.emit(searchString));
  }
}
