import { TColorStyle } from '@core/types/color-style.type';

export type TActionPosition = 'item' | 'bar';

export type TActionWithIcon = {
  icon: string;
  style: TColorStyle;
  disabled?: boolean;
  position: TActionPosition;
}

export type TActionItem<TEntity, TData = TActionWithIcon> = {
  label: string;
  handler: (entity: TEntity, ...args: any[]) => void;
  data: TData;
}

export type TViewActionItem<TAction, TEntity, TData = TActionWithIcon> =
  Omit<TActionItem<TEntity, TData>, 'handler'>
  & {
  value: TAction
};

export type TActionsMap<TAction extends string | number, TEntity, TData = undefined> = Record<TAction, TActionItem<TEntity, TData>>;

export const adaptMapToActions = <TAction extends string | number, TEntity, TData>(actions: TActionsMap<TAction, TEntity, TData>): Array<TViewActionItem<TAction, TEntity, TData>> => {
  return (Object.entries(actions) as Array<[TAction, TActionItem<TEntity, TData>]>).map(([value, {
    label,
    ...item
  }]) => ({
    label,
    value,
    data: item.data
  }));
};
