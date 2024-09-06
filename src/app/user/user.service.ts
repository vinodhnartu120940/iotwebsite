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
  userId:string ='';
  constructor(private http: ApiHttpService) {}
  get getDeviceId() {
    return localStorage.getItem('DeviceId');
  }

  GetSensorLatestData() {
    return this.http.get(
      `${APIEndPoints.Data}/GetSensorLatestData/${this.getDeviceId}`
    );
  }
  GetAllSensorsLatestData(){
    return this.http.get(`${APIEndPoints.Data}/GetAllSensorsLatestData`);
  }

  GetSensorWeeklyData(tenantId: any ,period: any){
    return this.http.get(`${APIEndPoints.Data}/GetSensorWeeklyData/${tenantId}/${period}`)
  }
  
  userInfo: any;
  GetUserInfo() {
    return this.http
      .get(`${APIEndPoints.Data}/GetUserInfo`)
      .subscribe((res: any) => {
        this.tenets = res?.Tenants;
        this.userInfo = res?.UserInfo;
        console.log(this.userInfo);
        this.userId = this.userInfo?.Id;
      });
  }
  GetAgronomicPractices(){
    return this.http.get(`${APIEndPoints.Data}/GetAgronomicPractices`);
  }
  SaveEstimatedYield(data:any){
    return this.http.post(`${APIEndPoints.Data}/SaveEstimatedYield`,data);
  }
}
