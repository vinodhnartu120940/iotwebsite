import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }
  GetSensorLatestData() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `bearer ${localStorage.getItem('token')}`,
    });
    return this.http.get(`${environment.serviceUrl}/Data/GetSensorLatestData`,{headers: headers,});
  }
}
