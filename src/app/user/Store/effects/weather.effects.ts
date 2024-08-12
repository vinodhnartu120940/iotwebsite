// src/app/store/weather/weather.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { mergeMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import {
  loadWeather,
  loadWeatherFailure,
  loadWeatherSuccess,
} from '../actions/weather.action';
import { ServicesService } from '../../Services/services.service';

@Injectable()
export class WeatherEffects {
  loadWeather$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadWeather),
      mergeMap(() =>
        this.weatherService.getWeatherData().pipe(
          map((weather) => loadWeatherSuccess({ weather })),
          catchError((error) => of(loadWeatherFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private weatherService: ServicesService
  ) {}
}
