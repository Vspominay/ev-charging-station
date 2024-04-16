import { signal } from '@angular/core';

import { adaptMapToActions, TActionsMap, TActionWithIcon } from '@shared/utils/types/actions.types';

export abstract class AActionService<TAction extends string | number, TEntity, TData = TActionWithIcon> {
  protected abstract actionsMap: TActionsMap<TAction, TEntity, TData>;

  get $actions() {
    return signal(adaptMapToActions(this.actionsMap));
  }

  handleAction(action: TAction, entity: TEntity, ...args: any[]) {
    const handler = this.getHandler(action);

    if (!handler) {
      console.warn(`There is no available ${action} action for selected entity`);
      return;
    }

    return handler.handler(entity, ...args);
  }

  private getHandler(action: TAction) {
    return this.actionsMap[action];
  }
}
