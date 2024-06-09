import { Injectable, TemplateRef } from '@angular/core';
import { TColorStyle } from '@core/types/color-style.type';

export interface IToastOptions {
  style?: TColorStyle;
  delay?: number;
  iconName?: string;
  title?: string;
  params?: Record<string, any>;
}

export interface IToast {
  content: string | TemplateRef<any>;
  options: IToastOptions;
}

export interface IToastWithTemplate {
  content: TemplateRef<any>;
  options: IToastOptions;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: IToast[] = [];

  show(textOrTpl: string | TemplateRef<any>, options: IToastOptions = {}) {
    this.toasts.push({ content: textOrTpl, options });
  }

  remove(toast: any) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
}
