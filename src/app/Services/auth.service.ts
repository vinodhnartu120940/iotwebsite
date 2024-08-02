import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Router } from '@angular/router';
import { APIEndPoints } from '../utils/api-endpoint';
import { ApiHttpService } from './api.http.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: ApiHttpService, private route: Router) {}
  signUp(data: any) {
    return this.http.post(`${APIEndPoints.Authentication}/Register`, data);
  }
  public get getStorageToken(): string {
    return localStorage.getItem('token') ?? '';
  }
  public get headerToken(): string {
    return this.getStorageToken ? 'Bearer ' + this.getStorageToken : '';
  }
  storeTokenLocally(result: any) {
    if (result != null) {
      if (result) {
        localStorage.setItem('token', result);
      }
    }
  }

  public get isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!!token) {
      return true;
    }
    return false;
  }

  getClimateData() {
    return this.http.get('http://192.168.1.72:5000/api/climatedata');
  }

  sendOtp(mobileNumber: any) {
    return this.http.post(`${APIEndPoints.Intractions}/SendSms`, mobileNumber);
  }

  ValidateOtp(data: any) {
    return this.http.post(`${APIEndPoints.Intractions}/ValidateOtp`, data);
  }

  ValidateMobileNumber(phoneNumber: any) {
    return this.http.post(
      `${APIEndPoints.Authentication}/ValidateMobileNumber`,
      phoneNumber
    );
  }
  logOut() {
    localStorage.removeItem('token');
    this.route.navigate(['']);
  }

  SaveOnBoardData(data: any) {
    return this.http.post(`${APIEndPoints.Data}/SaveOnBoardData`, data);
  }
}
