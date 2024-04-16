export type TColorStyle =
  'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'light'
  | 'dark'
  | 'purple'
  | 'white';

export type TLabelStyledConfig = {
  label: string;
  style: TColorStyle;
};
