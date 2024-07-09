import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumericOnly]',
  standalone: true
})
export class NumericOnlyDirective {
  private regex: RegExp = new RegExp(/^[0-9]*$/);

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event'])
  onInputChange(event: Event): void {
    const input = this.el.nativeElement as HTMLInputElement;
    const initialValue = input.value;
    if (!this.regex.test(initialValue)) {
      input.value = initialValue.replace(/[^0-9]/g, '');
      event.stopPropagation();
    }
  }
}
