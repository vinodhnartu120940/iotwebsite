// src/app/store/weather/weather.actions.ts
import { createAction, props } from '@ngrx/store';
import { WeatherResponse } from '../../../models/weather.modal';

export const loadWeather = createAction('[Weather] Load Weather');
export const loadWeatherSuccess = createAction(
  '[Weather] Load Weather Success',
  props<{ weather: WeatherResponse }>()
);
export const loadWeatherFailure = createAction(
  '[Weather] Load Weather Failure',
  props<{ error: any }>()
);
