import { Injectable } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private toastr: ToastrService) { }

  showSuccess(message: string, title = '') {
    this.toastr.success(message, title);
  }
  showAlert(message: string, title = 'Alert') {
    this.toastr.info(message, title, {
      disableTimeOut: true,
      closeButton: true,
      titleClass: 'alert-title',
      toastClass: 'alert-toast',
      positionClass: 'toast-center-center',
      messageClass: 'alert-message',
    });
  }
  showError(message: string, title = '') {
    this.toastr.error(message, title);
  }

  showInfo(message: string, title = '') {
    this.toastr.info(message, title);
  }

  showWarning(message: string, title = '') {
    this.toastr.warning(message, title, { positionClass: 'toast-top-right' });
  }
}
