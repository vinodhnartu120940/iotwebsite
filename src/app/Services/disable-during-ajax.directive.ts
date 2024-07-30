import {
  OnDestroy,
  OnInit,
  Directive,
  ElementRef,
  Input,
  HostListener,
} from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { Subject } from 'rxjs/internal/Subject';
import { LoadingService } from './loading.service';

@Directive({
  selector: '[disableDuringAjax]',
  standalone: true,
})
export class DisableButtonDuringAjax implements OnDestroy, OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();

  @Input() formValid: any;

  subscription!: Subscription;
  @HostListener('click', ['$event']) onClick($event: any) {
    this.el.nativeElement.classList.add('apitrigger');
  }
  constructor(private _loadService: LoadingService, private el: ElementRef) {}

  checkFormValidation(form: any) {
    if (form.valid == true) {
      this.checkAjaxProgress();
    }
    if (!form.valid && !this.el.nativeElement.classList.contains('spinning')) {
      this.el.nativeElement.classList.add('spinning');
      //this.el.nativeElement.disabled = true;
    }
  }

  checkAjaxProgress() {
    this.subscription = this._loadService.isButtonLoading.subscribe(
      (response) => {
        if (this.el.nativeElement.classList.contains('apitrigger')) {
          if (
            response &&
            !this.el.nativeElement.classList.contains('spinning')
          ) {
            this._loadService.buttonAPILoaded();
            this.el.nativeElement.classList.add('spinning');
          } else if (!response) {
            this._loadService.isButtonLoaded = false;
            this.el.nativeElement.classList.remove('spinning');
          }

          // Check form one more time
          if (this.formValid != null) {
            if (
              this.formValid.valid &&
              !this.el.nativeElement.classList.contains('spinning')
            ) {
              this.el.nativeElement.classList.add('spinning');
              //this.el.nativeElement.disabled = true;
            }
          }
        }
      }
    );
  }

  ngOnInit() {
    // If there is no form to check validation then just check the ajax progress
    if (this.formValid == null) {
      this.checkAjaxProgress();
    }
    // Else check the forms validation AND ajax progress
    else {
      this.checkFormValidation(this.formValid);
      this.formValid.valueChanges
        .takeUntil(this.ngUnsubscribe)
        .subscribe((data: any) => this.checkFormValidation(this.formValid));
    }
  }

  ngOnDestroy() {
    this._loadService.isButtonLoaded = false;
    this.subscription.unsubscribe();
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
