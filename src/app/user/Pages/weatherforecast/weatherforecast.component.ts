import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectDailyWeather,
  selectHourlyWeather,
  selectLatestWeather,
} from '../../Store/selector/weather.selector';
import { AsyncPipe, NgClass, NgFor } from '@angular/common';

@Component({
  selector: 'app-weatherforecast',
  standalone: true,
  imports: [AsyncPipe, NgFor, NgClass],
  templateUrl: './weatherforecast.component.html',
  styleUrl: './weatherforecast.component.scss',
})
export class WeatherforecastComponent {
  dailyWeather$ = this.store.select(selectDailyWeather);
  hourlyWeather$ = this.store.select(selectHourlyWeather);
  latestWeather$ = this.store.select(selectLatestWeather);
  constructor(private store: Store) {
    const hourlyWeather$ = this.store
      .select(selectLatestWeather)
      .subscribe((res) => console.log(res));
  }

}
