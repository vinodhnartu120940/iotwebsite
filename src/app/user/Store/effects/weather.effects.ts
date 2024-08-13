import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, map, catchError, switchMap } from 'rxjs/operators';
import { of, from } from 'rxjs';
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
      switchMap(() =>
        from(this.weatherService.getCurrentPosition()).pipe(
          switchMap((location) =>
            this.weatherService
              .getWeatherData(location.latitude, location.longitude)
              .pipe(
                map((weather) => loadWeatherSuccess({ weather })),
                catchError((error) => of(loadWeatherFailure({ error })))
              )
          ),
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
