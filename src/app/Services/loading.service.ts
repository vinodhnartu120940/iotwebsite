import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService implements OnDestroy {
  public isLoading = new BehaviorSubject(false);
  public isButtonLoading = new BehaviorSubject(false);
  public isButtonLoaded = false;
  ShowLoading() {
    this.isLoading.next(true);
  }
  HideLoading() {
    this.isLoading.next(false);
  }
  toggleLoading(data: any) {
    if (!this.isButtonLoaded) this.isLoading.next(data);
  }
  toggleButtonLoading(data: any) {
    this.isButtonLoading.next(data);
  }
  buttonAPILoaded() {
    this.isButtonLoaded = true;
    this.HideLoading();
  }
  ngOnDestroy() {
    this.isButtonLoading.complete();
    this.isLoading.complete();
  }
}
