import { NgTemplateOutlet } from '@angular/common';
import { Component, TemplateRef } from '@angular/core';
import { NgbToast, NgbToastHeader } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { IconDirective } from '@shared/directives/icon.directive';

import { IToast, IToastWithTemplate, ToastService } from './toast-service';

@Component({
  selector: 'app-toasts',
  standalone: true,
  template: `
    @for (toast of toastService.toasts; track toast) {
      <ngb-toast
        [animation]="true"
        [autohide]="true"
        [delay]="toast.options.delay || 5000"
        (hidden)="toastService.remove(toast)"
      >
        @if (isTemplate(toast)) {
          <ng-template [ngTemplateOutlet]="toast.content"></ng-template>
        } @else {
          <div class="alert alert-{{toast.options.style || 'info'}} alert-border-left alert-dismissible mb-0"
               role="alert">
            @if (toast.options.iconName; as icon) {
              <i [icon]="icon" class="me-2 align-middle"></i>
            }
            @if (toast.options.title; as title) {
              <strong>{{ title | translate }}</strong> -
            }

            {{ $any(toast.content) | translate: toast.options.params }}

            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="alert"
              aria-label="Close"
              (click)="toastService.remove(toast)"
            ></button>
          </div>
        }
      </ngb-toast>
    }
  `,
  imports: [
    NgbToast,
    NgTemplateOutlet,
    NgbToastHeader,
    IconDirective,
    TranslateModule
  ],
  host: {
    class: 'ngb-toasts position-fixed bottom-0 m-3'
  },
  styles: `
    :host {
      z-index: 1090;
    }

    ngb-toast::ng-deep .toast-body:has(.alert) {
      padding: 0;
    }
  `
})
export class ToastsContainer {
  constructor(public toastService: ToastService) { }

  isTemplate(toast: IToast): toast is IToastWithTemplate { return toast.content instanceof TemplateRef; }
}
