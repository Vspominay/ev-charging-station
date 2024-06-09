import { inject, Injectable } from '@angular/core';
import { ToastService } from '@shared/components/toastr/toast-service';
import Swal from 'sweetalert2';

export interface IServerErrorResponse {
  error: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly toastService = inject(ToastService);

  showServerError(error: IServerErrorResponse) {
    console.log(error);

    return Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.error
    });
  }

  showSuccess(message: string = 'Changes have been saved') {
    return Swal.fire({
      icon: 'success',
      title: 'Success',
      text: message,
      timer: 2000,
      timerProgressBar: true
    });
  }

  showToaster(message: string) {
    this.toastService.show(message, { delay: 5000 });
  }

  showErrorToast(message: string) {
    this.toastService.show(message, { style: 'danger', iconName: 'report', title: 'base.modals.error' });
  }
}
