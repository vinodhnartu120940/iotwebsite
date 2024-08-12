import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WeatherResponse } from '../../models/weather.modal';
import { APIEndPoints } from '../../utils/api-endpoint';
import { ApiHttpService } from '../../Services/api.http.service';

@Injectable({
  providedIn: 'root',
})
export class ServicesService {
  constructor(private http: ApiHttpService) {}

  getWeatherData(): Observable<WeatherResponse> {
    return this.http.get<WeatherResponse>(`${APIEndPoints.WeatherForecast}`);
  }
}
