import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { TViewActionItem } from '@shared/utils/types/actions.types';

@Directive({
  selector: '[actionsCard]',
  host: {
    class: 'd-block'
  },
  standalone: true,
})
export class ActionsCardDirective<TAction extends TViewActionItem<any, any>> {
  @Input() actions: Array<TAction> = [];
  @Input() secondaryActions: Array<TAction[]> = [];

  @Output() selectAction = new EventEmitter<TAction>;
}

export const withActionsCard = {
  directive: ActionsCardDirective,
  inputs: ['actions', 'secondaryActions'],
  outputs: ['selectAction']
};
