import { Pipe, PipeTransform } from '@angular/core';
import { TActionPosition, TViewActionItem } from '@shared/utils/types/actions.types';

@Pipe({
  name: 'actionPlacement',
  standalone: true
})
export class ActionPlacementPipe implements PipeTransform {
  public transform<TAction extends TViewActionItem<any, any>>(actions: Array<TAction>, placement: TActionPosition): Array<TAction> {
    return actions.filter(action => action.data.position === placement);
  }
}
