import {
  ApplicationConfig,
  Injectable,
  isDevMode,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { ApiHttpService } from './Services/api.http.service';
import { InterceptorService } from './Services/interceptor.service';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { weatherReducer } from './user/Store/reducer/weather.reducer';
import { WeatherEffects } from './user/Store/effects/weather.effects';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { map, Observable } from 'rxjs';

@Injectable()
export class SingleJsonLoader implements TranslateLoader {
  constructor(private http: HttpClient) {}

  getTranslation(lang: string): Observable<any> {
    return this.http
      .get('/i18n/translations.json')
      .pipe(map((res: any) => res[lang]));
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    provideAnimations(),
    provideAnimations(), // required animations providers
    provideToastr(),
    ApiHttpService,
    provideStore({ weather: weatherReducer }),
    provideEffects([WeatherEffects]),
    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
      traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
      connectInZone: true, // If set to true, the connection is established within the Angular zone
    }),
    {
      provide: TranslateLoader,
      useClass: SingleJsonLoader,
      deps: [HttpClient],
    },
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: SingleJsonLoader,
        deps: [HttpClient],
      },
    }).providers!,
  ],
};
