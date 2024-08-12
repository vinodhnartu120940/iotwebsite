// src/app/store/weather/weather.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { WeatherResponse } from '../../../models/weather.modal';
import {
  loadWeather,
  loadWeatherFailure,
  loadWeatherSuccess,
} from '../actions/weather.action';

export interface WeatherState {
  weather: WeatherResponse | null;
  loading: boolean;
  error: any;
}

export const initialState: WeatherState = {
  weather: null,
  loading: false,
  error: null,
};

export const weatherReducer = createReducer(
  initialState,
  on(loadWeather, (state) => ({ ...state, loading: true })),
  on(loadWeatherSuccess, (state, { weather }) => ({
    ...state,
    weather,
    loading: false,
    error: null,
  })),
  on(loadWeatherFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
