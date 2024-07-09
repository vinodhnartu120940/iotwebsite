import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private route: Router) { }
  signUp(data: any) {
    return this.http.post(`${environment.serviceUrl}/controller/Register`, data);
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
    return this.http.post(`${environment.serviceUrl}/controller/SendSms`, mobileNumber);
  }

  ValidateOtp(data: any) {
    return this.http.post(`${environment.serviceUrl}/controller/ValidateOtp`, data);
  }

  ValidateMobileNumber(phoneNumber: any) {
    return this.http.post(
      `${environment.serviceUrl}/controller/ValidateMobileNumber`,
      phoneNumber
    );
  }
  logOut() {
    localStorage.removeItem('token');
    this.route.navigate(['']);
  }

  SaveOnBoardData(data: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `bearer ${localStorage.getItem('token')}`,
    });
    return this.http.post(`${environment.serviceUrl}/Data/SaveOnBoardData`, data, {
      headers: headers,
    });
  }
}
