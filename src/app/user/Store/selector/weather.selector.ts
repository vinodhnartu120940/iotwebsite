// src/app/store/weather/weather.selectors.ts
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { WeatherState } from '../reducer/weather.reducer';


export const selectWeatherState =
  createFeatureSelector<WeatherState>('weather');

export const selectWeather = createSelector(
  selectWeatherState,
  (state: WeatherState) => state.weather
);

export const selectHourlyWeather = createSelector(
  selectWeather,
  (weather) => weather?.list.filter((_, index) => index < 8) // First 8 entries for hourly
);

export const selectDailyWeather = createSelector(selectWeather, (weather) => {
  const days = new Map<string, any>();

  weather?.list.forEach((weather) => {
    const date = new Date(weather.dt_txt).toDateString();
    if (!days.has(date)) {
      days.set(date, weather);
    } else {
      const existingWeather = days.get(date)!;
      existingWeather.main.temp_max = Math.max(
        existingWeather.main.temp_max,
        weather.main.temp_max
      );
      existingWeather.main.temp_min = Math.min(
        existingWeather.main.temp_min,
        weather.main.temp_min
      );
      existingWeather.weather = weather.weather;
    }
  });

  return Array.from(days.values());
});
