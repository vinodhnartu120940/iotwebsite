import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { GlobalConstants } from '../../utils/global-constants';
import { NumericOnlyDirective } from '../../Services/numeric-only-directive.directive';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { NgxOtpInputConfig, NgxOtpInputModule } from 'ngx-otp-input';
import { NotificationService } from '../../Services/notification.service';
import { HttpClient } from '@angular/common/http';
import { cropTypes, soilTypes } from '../../utils/farm.data';
import moment from 'moment';

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
    autofocus: true,
  };
  otp: any;
  soilTypes: string[] = soilTypes;
  cropTypes: string[] = cropTypes;

  handleFillEvent(value: string): void {
    this.otp = value;
  }
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private route: Router,
    private notificationService: NotificationService,
    private http: HttpClient
  ) {
    this.questionType = QuestionType;
    this.getLocation();
  }

  Continue() {
    if (this.signupForm.valid) {
      let {
        phoneNumber,
        firstName,
        email,
        country,
        state,
        district,
        zipcode,
        landSize,
        soilType,
        farmAdress,
        typeofCrop,
        growingStartDate,
        deviceStatus,
        latitude,
        longitude,
      } = this.signupForm.value;
      if (this.questionNumber === this.questionType.otp) {
        const data = {
          phoneNumber: phoneNumber.toString(),
          otp: this.otp,
        };
        this.auth.ValidateOtp(data).subscribe((res: any) => {
          if (res.status === 'Success') {
            this.auth
              .ValidateMobileNumber({ phoneNumber: phoneNumber.toString() })
              .subscribe((res: any) => {
                if (res.status === 'Success' && res.onBoardStatus) {
                  this.auth.storeTokenLocally(res.token);
                  this.route.navigate(['/user']);
                } else {
                  this.auth.storeTokenLocally(res.token);
                  this.questionNumber++;
                }
              });
          }
        });
      } else if (this.questionNumber === this.questionType.mobilenumber) {
        this.auth
          .sendOtp({ phoneNumber: phoneNumber.toString() })
          .subscribe((res: any) => {
            if (res.status === 'Success') {
              this.questionNumber++;
              this.notificationService.showInfo(
                'The OTP has been sent to your mobile number'
              );
              this.startTimer();
            }
          });
      } else if (this.questionNumber === this.questionType.user) {
        this.questionNumber++;
        return;
      }
      if (this.questionNumber === this.questionType.farm) {
        const onBoarddata = {
          phoneNumber: phoneNumber,
          name: firstName,
          email: email,
          country: country,
          state: state,
          district: district,
          zipCode: zipcode,
          landSize: landSize,
          farmAddress: farmAdress,
          deviceStatus: false,
          cropType: typeofCrop,
          soilType: soilType,
          cropGrowingStartDate: moment(growingStartDate).format(
            'YYYY-MM-DDTHH:mm:ss.SSS[Z]'
          ),
          onBoardingStatus: true,
          latitude: latitude,
          longitude: longitude,
        };
        this.auth.SaveOnBoardData(onBoarddata).subscribe((res) => {
          this.route.navigate(['/user']);
        });
      }
    } else {
      this.signupForm.markAllAsTouched();
    }
  }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      phoneNumber: ['', [Validators.pattern(/^[0-9]{10}$/)]],
      firstName: ['', [Validators.pattern(GlobalConstants.firstnamePattern)]],
      // lastName: ['', [Validators.pattern(GlobalConstants.firstnamePattern)]],
      email: ['', [Validators.pattern(GlobalConstants.emailPattern)]],
      country: ['', [Validators.pattern(GlobalConstants.firstnamePattern)]],
      state: ['', [Validators.pattern(GlobalConstants.firstnamePattern)]],
      district: ['', [Validators.pattern(GlobalConstants.firstnamePattern)]],
      zipcode: ['', [Validators.pattern(/^[0-9]{6}$/)]],
      landSize: [''],
      soilType: [null],
      farmAdress: [''],
      typeofCrop: [null],
      growingStartDate: [''],
      deviceStatus: [false],
      latitude: [''],
      longitude: [''],
    });
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
      }
    }, 1000);
  }

  resendOtp() {
    let { phoneNumber } = this.signupForm.value;
    this.canResend = false;
    this.auth
      .sendOtp({ phoneNumber: phoneNumber.toString() })
      .subscribe((res: any) => {
        if (res.status === 'Success') {
          this.notificationService.showInfo(
            'The OTP has been sent to your mobile number'
          );
          this.startTimer();
        }
      });
  }

  get buttonText() {
    switch (this.questionNumber) {
      case 0:
        return 'Send OTP';
      case 1:
        return 'Validate OTP';
      case 2:
        return 'Next';
      case 3:
        return 'Register';
      default:
        return 'Unknown Action'; // Handle unexpected values
    }
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        // Call reverse geocoding API
        this.http
          .get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          )
          .subscribe(
            (data: any) => {
              this.signupForm.patchValue({
                latitude: data.lat,
                longitude: data.lon,
                state: data.address.state,
                zipcode: data.address.postcode,
                farmAdress: data.display_name,
              });
            },
            (error) => {
              console.log('Error fetching data:', error);
            }
          );
      });
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }
}
export enum QuestionType {
  mobilenumber = 0,
  otp = 1,
  user = 2,
  farm = 3,
}
