import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  tenets: any;
  constructor(private http: HttpClient) {}
  get getDeviceId() {
    return localStorage.getItem('DeviceId');
  }
  GetSensorLatestData() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `bearer ${localStorage.getItem('token')}`,
    });
    return this.http.get(
      `${environment.serviceUrl}/Data/GetSensorLatestData/${this.getDeviceId}`,
      {
        headers: headers,
      }
    );
  }
  userInfo: any;
  GetUserInfo() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `bearer ${localStorage.getItem('token')}`,
    });
    return this.http
      .get(`${environment.serviceUrl}/Data/GetUserInfo`, { headers: headers })
      .subscribe((res: any) => {
        this.tenets = res?.tenants;
        this.userInfo = res?.userInfo;
        console.log(this.userInfo);
      });
  }
}
