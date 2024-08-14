import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { NotificationService } from '../../../Services/notification.service';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-yield-calculator',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf],
  templateUrl: './yield-calculator.component.html',
  styleUrls: ['./yield-calculator.component.scss']
})
export class YieldCalculatorComponent {

  yieldForm: FormGroup;
  yieldResult: number | null = null;

  constructor(private fb: FormBuilder, private notify: NotificationService,private userService:UserService) {
    this.yieldForm = this.fb.group({
      coffeeVariant: ['robusta', Validators.required],
      area: [null, [Validators.required, Validators.min(1)]],
      soilMoisture: [null, [Validators.required, Validators.min(30), Validators.max(100)]],
      temperature: [null, [Validators.required, Validators.min(10), Validators.max(40)]],
      rainfall: [null, [Validators.required, Validators.min(1)]],
      pestPresence: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
    });
  }

  onSubmit(): void {

    if (this.yieldForm.valid) {
      const { coffeeVariant, area, soilMoisture, temperature, rainfall, pestPresence } = this.yieldForm.value;
      let baselineYield = 0;
      let adjustmentFactor = 1.0;

      if (coffeeVariant === 'robusta') {
        baselineYield = 0.8 * area;
      } else if (coffeeVariant === 'arabica') {
        baselineYield = 1.0 * area;
      }

      if (coffeeVariant === 'arabica' && soilMoisture < 70) {
        adjustmentFactor *= 0.95;
      }

      if (coffeeVariant === 'arabica' && temperature > 26) {
        adjustmentFactor *= 0.95;
      } else if (coffeeVariant === 'robusta' && temperature > 28) {
        adjustmentFactor *= 0.95;
      }

      adjustmentFactor *= 0.90;
      adjustmentFactor *= (1 - (pestPresence / 100));

      this.yieldResult = baselineYield * adjustmentFactor;
      const data = {
        "coffeeVariant": coffeeVariant,
        "area": area,
        "soilMoisture":soilMoisture,
        "temperature": temperature,
        "rainfall": rainfall,
        "pestPresence": pestPresence,
        "estimatedYield": this.yieldResult
      }
      console.log(data);
      this.yieldForm.reset();
      
      this.userService.SaveEstimatedYield(data).subscribe((res)=>{
        console.log(res);

      })
    }
  }

  get f(): { [key: string]: AbstractControl; } {
    return this.yieldForm.controls;
  }
}
