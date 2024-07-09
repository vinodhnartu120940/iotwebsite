import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { GlobalConstants } from '../../utils/global-constants';
import { NumericOnlyDirective } from '../../Services/numeric-only-directive.directive';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { NgxOtpInputConfig, NgxOtpInputModule } from 'ngx-otp-input';
import { NotificationService } from '../../Services/notification.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, NumericOnlyDirective, NgxOtpInputModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnInit {
  questionType: any;
  questionNumber: number = 0;
  signupForm: any;
  canResend: boolean = false;
  otpInputConfig: NgxOtpInputConfig = {
    otpLength: 6,
    autofocus: true
  };
  otp: any;

  handeOtpChange(value: string[]): void {
    console.log(value);
  }

  handleFillEvent(value: string): void {
    this.otp = value;
  }
  constructor(private fb: FormBuilder, private auth: AuthService, private route: Router, private notificationService: NotificationService) {
    this.questionType = QuestionType;
  }
  // Continue() {
  //   if (this.signupForm.valid) {
  //     if (this.questionNumber === this.questionType.user) {
  //       this.SignUp();
  //     } else {
  //       this.questionNumber++;
  //     }

  //     this.startTimer();
  //     this.signupForm.markAsUntouched();
  //   } else {
  //     this.signupForm.markAllAsTouched();
  //   }
  // }

  // Continue() {
  //   this.notificationService.showWarning("Hello World!");
  //   if (this.signupForm.valid) {
  //     let { phoneNumber } = this.signupForm.value;
  //     if (this.questionNumber === this.questionType.otp) {
  //       const data = {
  //         phoneNumber: phoneNumber.toString(),
  //         otp: this.otp
  //       }
  //       this.auth.ValidateOtp(data).subscribe((res: any) => {
  //         if (res.status === "Success") {
  //           this.auth.ValidateMobileNumber({ phoneNumber: phoneNumber.toString() }).subscribe((res: any) => {
  //             if (res.status === "Success" && res.onBoardStatus) {
  //               this.auth.storeTokenLocally(res.token);
  //               this.route.navigate(['/user']);

  //             } else {
  //               this.auth.storeTokenLocally(res.token);
  //               this.questionNumber++;
  //             }
  //           })
  //         }
  //       })
  //     } else {
  //       this.auth.sendOtp({ phoneNumber: phoneNumber.toString() }).subscribe((res: any) => {
  //         if (res.status === "Success") {
  //           this.questionNumber++;
  //           this.startTimer();
  //         }
  //       }

  //       )
  //     }



  //   } else {
  //     this.signupForm.markAllAsTouched();
  //   }
  // }
  Continue() {
    this.notificationService.showWarning("Hello World!");
    if (this.questionNumber === this.questionType.farm) {
      this.route.navigate(['/user']);
    } else {
      this.questionNumber++;
    }
  }


  SignUp() {
    let { email, firstName, lastName, password, phoneNumber } = this.signupForm.value;
    const data = {
      firstName: firstName,
      lastName: lastName,
      // userName: `${lastName}+""+${firstName}`,
      phoneNumber: phoneNumber.toString(),
      email: email,
      password: password
    }
    this.route.navigate(['/user']);
    this.auth.signUp(data).subscribe(res => {
      console.log(res);
    })
  }
  editMobileNumber() {
    this.questionNumber--;
  }
  ngOnInit(): void {
    this.signupForm = this.fb.group(
      {
        phoneNumber: ['', [Validators.pattern(/^[0-9]{10}$/)]],
        firstName: ['', [Validators.pattern(GlobalConstants.firstnamePattern)]],
        lastName: ['', [Validators.pattern(GlobalConstants.firstnamePattern)]],
        email: ['', [Validators.pattern(GlobalConstants.emailPattern)]],
        password: ['', [Validators.pattern(GlobalConstants.passwordpattern)]],
        country: ['', [Validators.pattern(GlobalConstants.firstnamePattern)]],
        state: ['', [Validators.pattern(GlobalConstants.firstnamePattern)]],
        district: ['', [Validators.pattern(GlobalConstants.firstnamePattern)]],
        zipcode: ['', [Validators.pattern(/^[0-9]{6}$/)]],
        landSize: [''],
        soilType: [''],
        farmAdress: [''],
        typeofCrop: [],
        growingStartDate: [''],
        deviceStatus: [false],
        confirmPassword: [
          '',
          [Validators.pattern(GlobalConstants.passwordpattern)],
        ],
        otp: [''],
      },
      { validators: this.passwordMatchValidator }
    );



  }
  passwordMatchValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    return password &&
      confirmPassword &&
      password.value !== confirmPassword.value
      ? { passwordMismatch: true }
      : null;
  };

  get passwordMismatch(): boolean {
    return (
      this.signupForm.hasError('passwordMismatch') &&
      this.signupForm.get('confirmPassword').touched
    );
  }
  onInput(event: any) {
    const input = event.target.value;
    event.target.value = input.replace(/[^0-9]/g, '');
  }

  minutes: string = '02';
  seconds: string = '00';
  private timer: any;
  startTimer() {
    let time = 120;
    this.timer = setInterval(() => {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      this.minutes = `${minutes < 10 ? '0' : ''}${minutes}`;
      this.seconds = `${seconds < 10 ? '0' : ''}${seconds}`;
      time--;
      if (time < 0) {
        clearInterval(this.timer);
        this.canResend = true;
        // this.canEdit = true;
      }
    }, 1000);
  }

  resendOtp() {
    this.canResend = false;
    this.startTimer();
  }

  get buttonText() {
    switch (this.questionNumber) {
      case 0:
        return "Send OTP";
      case 1:
        return "Validate OTP";
      case 2:
        return "Next";
      case 3:
        return "Register";
      default:
        return "Unknown Action"; // Handle unexpected values
    }
  }
}
export enum QuestionType {
  mobilenumber = 0,
  otp = 1,
  user = 2,
  farm = 3
}
