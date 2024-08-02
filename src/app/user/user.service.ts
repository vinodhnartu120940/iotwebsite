import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiHttpService } from '../Services/api.http.service';
import { APIEndPoints } from '../utils/api-endpoint';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  tenets: any;
  constructor(private http: ApiHttpService) {}
  get getDeviceId() {
    return localStorage.getItem('DeviceId');
  }

  GetSensorLatestData() {
    return this.http.get(
      `${APIEndPoints.Data}/GetSensorLatestData/${this.getDeviceId}`
    );
  }

  userInfo: any;
  GetUserInfo() {
    return this.http
      .get(`${APIEndPoints.Data}/GetUserInfo`)
      .subscribe((res: any) => {
        this.tenets = res?.tenants;
        this.userInfo = res?.userInfo;
        console.log(this.userInfo);
      });
  }
}
