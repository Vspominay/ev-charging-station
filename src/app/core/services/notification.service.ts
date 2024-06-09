import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

export interface IServerErrorResponse {
  error: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
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
}
