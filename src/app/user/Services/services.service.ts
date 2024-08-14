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

  // Method to get the current position
  getCurrentPosition(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            console.error('Error getting location', error);
            reject(error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
        reject('Geolocation is not supported by this browser.');
      }
    });
  }

  // Method to get weather data by passing latitude and longitude dynamically
  getWeatherData(
    latitude: number,
    longitude: number
  ): Observable<WeatherResponse> {
    return this.http.get<WeatherResponse>(
      `${APIEndPoints.WeatherForecast}/forecast?lat=${latitude}&lon=${longitude}`
    );
  }
}
